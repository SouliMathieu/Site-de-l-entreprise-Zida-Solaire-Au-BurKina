// app/admin/devis/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DevisStatusClient } from "@/components/admin/DevisStatusClient";

interface PageProps {
  params: { id: string };
}

export const metadata = {
  title: "Détail demande de devis | Admin ZIDA SOLAIRE",
  description: "Détail d'une demande de devis client ZIDA SOLAIRE.",
};

export default async function AdminDevisDetailPage({ params }: PageProps) {
  const request = await prisma.installationRequest.findUnique({
    where: { id: params.id },
  });

  if (!request) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-sm text-red-600">Demande introuvable.</p>
        <Link
          href="/admin/devis"
          className="mt-4 inline-flex text-xs text-orange-600 hover:underline"
        >
          ← Retour aux demandes de devis
        </Link>
      </main>
    );
  }

  const createdAt = new Date(request.createdAt).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const preferredDate = request.preferredDate
    ? new Date(request.preferredDate).toLocaleDateString("fr-FR")
    : null;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link
        href="/admin/devis"
        className="text-xs text-orange-600 hover:underline"
      >
        ← Retour aux demandes de devis
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Demande {request.requestNumber}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Créée le {createdAt} — Type : {request.installationType}
          </p>
        </div>

        <DevisStatusClient
          requestId={request.id}
          initialStatus={request.status}
        />
      </div>

      {/* Infos client */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-2 text-sm">
        <h2 className="text-base font-semibold text-slate-900 mb-2">
          Informations client
        </h2>
        <p className="text-slate-800">
          <span className="font-medium">Nom :</span> {request.customerName}
        </p>
        <p className="text-slate-700">
          <span className="font-medium">Téléphone :</span>{" "}
          {request.customerPhone}
        </p>
        {request.customerEmail && (
          <p className="text-slate-700">
            <span className="font-medium">Email :</span>{" "}
            {request.customerEmail}
          </p>
        )}
        {request.customerAddress && (
          <p className="text-slate-700">
            <span className="font-medium">Adresse :</span>{" "}
            {request.customerAddress}
          </p>
        )}
      </section>

      {/* Détails de la demande */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-sm space-y-3">
        <h2 className="text-base font-semibold text-slate-900 mb-2">
          Détails de la demande
        </h2>

        <div>
          <p className="font-medium text-slate-800">Type d'installation</p>
          <p className="text-slate-700">{request.installationType}</p>
        </div>

        <div>
          <p className="font-medium text-slate-800">Description du projet</p>
          <p className="text-slate-700 whitespace-pre-wrap">
            {request.description}
          </p>
        </div>

        {(preferredDate || request.preferredTime) && (
          <div>
            <p className="font-medium text-slate-800">
              Date/Heure souhaitée pour la visite
            </p>
            <p className="text-slate-700">
              {preferredDate || "Non précisée"}
              {request.preferredTime && ` à ${request.preferredTime}`}
            </p>
          </div>
        )}

        {request.estimatedCost && (
          <div>
            <p className="font-medium text-slate-800">Coût estimé</p>
            <p className="text-lg font-bold text-slate-900">
              {Number(request.estimatedCost).toLocaleString("fr-FR")} FCFA
            </p>
          </div>
        )}

        {request.technicianNotes && (
          <div>
            <p className="font-medium text-slate-800">Notes du technicien</p>
            <p className="text-xs text-slate-600 whitespace-pre-wrap">
              {request.technicianNotes}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
