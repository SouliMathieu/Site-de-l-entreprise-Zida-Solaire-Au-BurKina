// app/admin/devis/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DevisStatusClient } from "@/components/admin/DevisStatusClient";
import { Trash2, ClipboardList } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Détail d'une demande de devis | Admin ZIDA SOLAIRE",
  description: "Détail d'une demande de devis client ZIDA SOLAIRE.",
};

export default async function AdminDevisDetailPage({ params }: PageProps) {
  const { id } = await params;

  const request = await prisma.installationRequest.findUnique({
    where: { id },
  });

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 px-8 py-6 text-center space-y-3">
          <h1 className="text-xl font-bold text-gray-900">
            Demande introuvable
          </h1>
          <p className="text-gray-500">
            La demande que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <Link
            href="/admin/devis"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary hover:text-orange-600"
          >
            ← Retour aux demandes de devis
          </Link>
        </div>
      </div>
    );
  }

  const createdAt = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(request.createdAt);

  const preferredDate = request.preferredDate
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }).format(request.preferredDate)
    : null;

  const estimatedCost =
    request.estimatedCost !== null
      ? `${Number(request.estimatedCost).toLocaleString("fr-FR")} FCFA`
      : "Non renseigné";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-xl">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Demande #{request.requestNumber}
              </h1>
              <p className="text-sm text-gray-500">
                Créée le {createdAt} — Type : {request.installationType}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <DevisStatusClient
              requestId={request.id}
              initialStatus={request.status}
            />
            <Link
              href="/admin/devis"
              className="text-xs font-medium text-gray-500 hover:text-primary"
            >
              ← Retour à la liste
            </Link>
          </div>
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 space-y-6">
          {/* Infos client */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-gray-500">
                Informations client
              </h2>
              <p className="text-base font-semibold text-gray-900">
                {request.customerName}
              </p>
              <p className="text-sm text-gray-700">
                Téléphone :{" "}
                <span className="font-medium">{request.customerPhone}</span>
              </p>
              {request.customerEmail && (
                <p className="text-sm text-gray-700">
                  Email :{" "}
                  <span className="font-medium">{request.customerEmail}</span>
                </p>
              )}
              {request.customerAddress && (
                <p className="text-sm text-gray-700">
                  Adresse :{" "}
                  <span className="font-medium">
                    {request.customerAddress}
                  </span>
                </p>
              )}
            </div>

            {/* Infos projet */}
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-gray-500">
                Détails du projet
              </h2>
              <p className="text-sm text-gray-700">
                Type d'installation :{" "}
                <span className="font-medium">
                  {request.installationType}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                Date/heure souhaitée :{" "}
                <span className="font-medium">
                  {preferredDate || "Non précisée"}
                  {request.preferredTime &&
                    ` à ${request.preferredTime}`}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                Coût estimé :{" "}
                <span className="font-medium">{estimatedCost}</span>
              </p>
            </div>
          </section>

          {/* Description */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-500">
              Description du projet
            </h2>
            <p className="text-sm text-gray-800 whitespace-pre-line">
              {request.description || "Aucune description fournie."}
            </p>
          </section>

          {/* Notes technicien */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-500">
              Notes du technicien
            </h2>
            <p className="text-sm text-gray-800 whitespace-pre-line">
              {request.technicianNotes || "Aucune note pour le moment."}
            </p>
          </section>

          {/* Bouton supprimer (optionnel, via DevisActionsClient ou simple lien) */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Link
              href={`/admin/devis`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Pour supprimer, utilisez le bouton sur la liste des devis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
