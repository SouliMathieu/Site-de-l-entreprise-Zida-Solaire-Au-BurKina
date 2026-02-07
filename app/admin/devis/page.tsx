// app/admin/devis/page.tsx
import { prisma } from "@/lib/prisma";
import { DevisStatusClient } from "@/components/admin/DevisStatusClient";
import { DevisActionsClient } from "@/components/admin/DevisActionsClient";
import { ClipboardList } from "lucide-react";

export const metadata = {
  title: "Demandes de devis | Admin ZIDA SOLAIRE",
  description: "Suivi des demandes d'installation.",
};

type RequestStatus =
  | "NEW"
  | "CONTACTED"
  | "QUOTED"
  | "ACCEPTED"
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED";

const STATUS_LABEL: Record<RequestStatus, string> = {
  NEW: "Nouvelle",
  CONTACTED: "Contacté",
  QUOTED: "Devis envoyé",
  ACCEPTED: "Acceptée",
  SCHEDULED: "Planifiée",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};

const STATUS_CLASS: Record<RequestStatus, string> = {
  NEW: "bg-blue-50 text-blue-700",
  CONTACTED: "bg-sky-50 text-sky-700",
  QUOTED: "bg-purple-50 text-purple-700",
  ACCEPTED: "bg-emerald-50 text-emerald-700",
  SCHEDULED: "bg-amber-50 text-amber-700",
  COMPLETED: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-red-50 text-red-700",
};

const TYPE_LABEL: Record<string, string> = {
  SOLAR: "Solaire",
  ELECTRICAL: "Électrique",
  PLUMBING: "Plomberie",
  OTHER: "Autre",
};

export default async function AdminDevisPage() {
  const requests = await prisma.installationRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-xl">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Demandes de devis
              </h1>
              <p className="text-sm text-gray-500">
                Liste des demandes d'installation ({requests.length} résultat
                {requests.length > 1 ? "s" : ""}).
              </p>
            </div>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          {requests.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              Aucune demande de devis pour le moment.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      N° demande
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Téléphone
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Créée le
                    </th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requests.map((request) => {
                    const status = request.status as RequestStatus;
                    const typeLabel =
                      TYPE_LABEL[request.installationType] ??
                      request.installationType;

                    return (
                      <tr
                        key={request.id}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="px-6 py-3 font-mono text-xs text-gray-700">
                          {request.requestNumber}
                        </td>
                        <td className="px-6 py-3 text-gray-800 font-medium">
                          {request.customerName}
                        </td>
                        <td className="px-6 py-3 text-gray-700">
                          {request.customerPhone}
                        </td>
                        <td className="px-6 py-3 text-gray-700">
                          {typeLabel}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${STATUS_CLASS[status]}`}
                          >
                            {STATUS_LABEL[status]}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-600">
                          {formatDate(request.createdAt)}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-end gap-3">
                            {/* Changement de statut inline */}
                            <DevisStatusClient
                              requestId={request.id}
                              initialStatus={request.status}
                            />
                            {/* Voir + Supprimer */}
                            <DevisActionsClient
                              requestId={request.id}
                              requestNumber={request.requestNumber}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
