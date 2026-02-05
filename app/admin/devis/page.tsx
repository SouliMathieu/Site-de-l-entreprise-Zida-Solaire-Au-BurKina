// app/admin/devis/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Demandes de devis | Admin ZIDA SOLAIRE",
  description: "Liste des demandes de devis clients ZIDA SOLAIRE.",
};

export default async function AdminDevisPage() {
  const requests = await prisma.installationRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Demandes de devis
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Liste des demandes d'installation ({requests.length} résultat
            {requests.length > 1 ? "s" : ""}).
          </p>
        </div>
      </div>

      {requests.length === 0 ? (
        <p className="text-sm text-slate-500">
          Aucune demande de devis pour le moment.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold text-slate-600">
                <th className="px-4 py-3">N° demande</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Téléphone</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Créée le</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => {
                const createdAt = new Date(request.createdAt).toLocaleString(
                  "fr-FR",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                );

                let statusColor = "bg-slate-100 text-slate-700";
                if (request.status === "NEW")
                  statusColor = "bg-blue-100 text-blue-700";
                if (request.status === "CONTACTED")
                  statusColor = "bg-purple-100 text-purple-700";
                if (request.status === "QUOTED")
                  statusColor = "bg-amber-100 text-amber-700";
                if (request.status === "ACCEPTED")
                  statusColor = "bg-emerald-100 text-emerald-700";
                if (request.status === "SCHEDULED")
                  statusColor = "bg-indigo-100 text-indigo-700";
                if (request.status === "COMPLETED")
                  statusColor = "bg-green-100 text-green-700";
                if (request.status === "CANCELLED")
                  statusColor = "bg-red-100 text-red-700";

                return (
                  <tr
                    key={request.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-slate-900">
                      {request.requestNumber}
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      {request.customerName}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {request.customerPhone}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {request.installationType}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusColor}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {createdAt}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/devis/${request.id}`}
                        className="text-xs font-semibold text-orange-600 hover:underline"
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
