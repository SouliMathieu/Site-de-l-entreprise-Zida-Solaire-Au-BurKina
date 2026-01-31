// prisma/seed.ts
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed...');

  // 1. Créer l'administrateur
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@zidasolaire.com' },
    update: {},
    create: {
      email: 'admin@zidasolaire.com',
      password: hashedPassword,
      name: 'Administrateur ZIDA',
      role: UserRole.ADMIN,
    },
  });

  console.log('✅ Utilisateur admin créé:', admin.email);

  // 2. Créer les catégories principales
  const categories = [
    {
      name: 'Panneaux Solaires',
      slug: 'panneaux-solaires',
      description: 'Panneaux photovoltaïques de haute qualité',
      order: 1,
    },
    {
      name: 'Batteries & Stockage',
      slug: 'batteries-stockage',
      description: "Batteries et solutions de stockage d'énergie",
      order: 2,
    },
    {
      name: 'Onduleurs & Régulateurs',
      slug: 'onduleurs-regulateurs',
      description: 'Onduleurs, régulateurs de charge et accessoires',
      order: 3,
    },
    {
      name: 'Kits Solaires Complets',
      slug: 'kits-solaires-complets',
      description: 'Kits solaires résidentiels et commerciaux',
      order: 4,
    },
    {
      name: 'Équipements Électriques',
      slug: 'equipements-electriques',
      description: 'Matériel électrique et câblage',
      order: 5,
    },
    {
      name: 'Pompage & Forage',
      slug: 'pompage-forage',
      description: 'Systèmes de pompage solaire et forage',
      order: 6,
    },
    {
      name: 'Accessoires',
      slug: 'accessoires',
      description: 'Câbles, connecteurs et accessoires divers',
      order: 7,
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('✅ Catégories créées');

  // 3. Créer la configuration du site
  await prisma.siteSettings.upsert({
    where: { id: '1' }, // on force un id fixe pour avoir un seul enregistrement
    update: {},
    create: {
      id: '1',
      siteName: 'ZIDA SOLAIRE',
      siteDescription:
        'Votre partenaire en solutions solaires et électriques au Burkina Faso',
      contactEmail: 'contact@zidasolaire.com',
      contactPhone: '+226 XX XX XX XX',
      whatsappNumber: '+226 74 33 99 77',
      address: 'Ouagadougou, Burkina Faso',
      openingHours: {
        lundi: '08:00 - 18:00',
        mardi: '08:00 - 18:00',
        mercredi: '08:00 - 18:00',
        jeudi: '08:00 - 18:00',
        vendredi: '08:00 - 18:00',
        samedi: '08:00 - 13:00',
        dimanche: 'Fermé',
      },
      deliveryFeeOuagadougou: 2000,
      deliveryFeeOtherCities: 5000,
      freeDeliveryThreshold: 50000,
      banners: [],
      socialMedia: {
        facebook: 'https://facebook.com/zidasolaire',
        instagram: 'https://instagram.com/zidasolaire',
        linkedin: 'https://linkedin.com/company/zidasolaire',
      },
    },
  });

  console.log('✅ Configuration du site créée');
  console.log('🎉 Seed terminé avec succès!');
  console.log('📧 Email admin: admin@zidasolaire.com');
  console.log('🔑 Mot de passe: Admin@123');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
