'use strict';

// Intégration réelle des formulaires, sur une base PostgreSQL jetable de CI uniquement.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { PrismaClient } = require('@prisma/client');

if (
  process.env.FORMS_TEST_DATABASE !== 'isolated-postgres' ||
  !/^postgresql:\/\/ztesting:ztesting@localhost:5432\/ztesting(?:\?|$)/.test(process.env.DATABASE_URL || '')
) {
  throw new Error('Refus de lancer les tests de formulaires hors PostgreSQL temporaire de CI.');
}

const prisma = new PrismaClient();
const baseUrl = 'http://127.0.0.1:3000';

async function request(path, body, options = {}) {
  const response = await fetch(baseUrl + path, {
    method: options.method || 'POST',
    headers: { 'content-type': 'application/json', ...options.headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  const result = await response.json();
  return { status: response.status, result };
}

test('API devis : validation, enregistrement et affichage fidèle des champs', async (t) => {
  const createdIds = [];
  try {
    const data = {
      name: 'Test CI ZIDA Devis',
      phone: '+22670000001',
      address: 'Ouagadougou - essai CI',
      systemType: 'pumping',
      estimatedBudget: '500 000 - 1 000 000 FCFA',
      message: 'Pompage pour irrigation',
      email: '',
    };

    await t.test('Un e-mail malformé est rejeté avant toute écriture', async () => {
      const res = await request('/api/devis', { ...data, email: 'invalide' });
      assert.equal(res.status, 400);
      assert.match(res.result.error, /e-mail invalide/i);
    });

    await t.test('Un type de projet inconnu est refusé', async () => {
      const res = await request('/api/devis', { ...data, systemType: 'unknown' });
      assert.equal(res.status, 400);
    });

    await t.test('Le téléphone et l’adresse sont obligatoires', async () => {
      const res = await request('/api/devis', { ...data, address: '' });
      assert.equal(res.status, 400);
    });

    await t.test('Une demande valide sans e-mail est enregistrée', async () => {
      const res = await request('/api/devis', data);
      assert.equal(res.status, 201, JSON.stringify(res.result));
      assert.ok(res.result.requestId);
      createdIds.push(res.result.requestId);
      const saved = await prisma.installationRequest.findUnique({
        where: { id: res.result.requestId },
      });
      assert.ok(saved);
      assert.equal(saved.customerName, data.name);
      assert.equal(saved.customerPhone, data.phone);
      assert.equal(saved.customerAddress, data.address);
      assert.equal(saved.customerEmail, null);
      assert.equal(saved.installationType, 'SOLAR');
      assert.equal(saved.status, 'NEW');
      assert.match(saved.description, /Système de pompage solaire/);
      assert.ok(saved.description.includes(data.estimatedBudget));
      assert.ok(saved.description.includes(data.message));
    });

    await t.test('Le type « autre » est conservé dans la fiche devis', async () => {
      const res = await request('/api/devis', { ...data, systemType: 'other', email: 'client@example.com' });
      assert.equal(res.status, 201, JSON.stringify(res.result));
      createdIds.push(res.result.requestId);
      const saved = await prisma.installationRequest.findUnique({ where: { id: res.result.requestId } });
      assert.equal(saved.installationType, 'OTHER');
      assert.equal(saved.customerEmail, 'client@example.com');
      assert.match(saved.description, /Autre projet/);
    });
  } finally {
    await prisma.installationRequest.deleteMany({ where: { id: { in: createdIds } } });
  }
});

test('API contact : les champs facultatifs sont réellement facultatifs', async (t) => {
  const createdIds = [];
  const data = { name: 'Test CI Contact', phone: '+22670000002', message: 'Question sur un panneau' };
  try {
    await t.test('Contact sans e-mail ni sujet accepté', async () => {
      const res = await request('/api/contact', data);
      assert.equal(res.status, 201, JSON.stringify(res.result));
      createdIds.push(res.result.contactId);
      const saved = await prisma.contactMessage.findUnique({ where: { id: res.result.contactId } });
      assert.ok(saved);
      assert.equal(saved.email, '');
      assert.equal(saved.subject, 'Demande de contact');
      assert.equal(saved.message, data.message);
    });

    await t.test('Contact avec un e-mail non valide refusé', async () => {
      const res = await request('/api/contact', { ...data, email: 'non-valide' });
      assert.equal(res.status, 400);
    });

    await t.test('Contact sans message refusé', async () => {
      const res = await request('/api/contact', { ...data, message: '' });
      assert.equal(res.status, 400);
    });
  } finally {
    await prisma.contactMessage.deleteMany({ where: { id: { in: createdIds } } });
  }
});

test('Sécurité profil : changement d’e-mail sans vérification interdit', async (t) => {
  const { SignJWT } = await import('jose');
  const customer = await prisma.customer.create({
    data: {
      firstName: 'Test',
      lastName: 'CI',
      phone: '+22670000003',
      email: 'original@example.com',
    },
  });
  try {
    const token = await new SignJWT({ id: customer.id, phone: customer.phone, type: 'customer' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('10m')
      .sign(new TextEncoder().encode(process.env.NEXTAUTH_SECRET));
    const headers = { authorization: 'Bearer ' + token };

    await t.test('Modification d’e-mail rejetée', async () => {
      const res = await request('/api/customer/profile', { email: 'autre@example.com' }, { method: 'PATCH', headers });
      assert.equal(res.status, 403, JSON.stringify(res.result));
      const saved = await prisma.customer.findUnique({ where: { id: customer.id } });
      assert.equal(saved.email, customer.email);
    });

    await t.test('Autres informations modifiables avec e-mail identique', async () => {
      const res = await request('/api/customer/profile', { firstName: 'Essai', email: customer.email }, { method: 'PATCH', headers });
      assert.equal(res.status, 200, JSON.stringify(res.result));
      const saved = await prisma.customer.findUnique({ where: { id: customer.id } });
      assert.equal(saved.firstName, 'Essai');
      assert.equal(saved.email, customer.email);
    });

    await t.test('Numéro de connexion non modifiable sans vérification', async () => {
      const res = await request('/api/customer/profile', { phone: '+22670000004' }, { method: 'PATCH', headers });
      assert.equal(res.status, 403);
    });
  } finally {
    await prisma.customer.delete({ where: { id: customer.id } });
  }
});

test.after(async () => {
  await prisma.$disconnect();
});
