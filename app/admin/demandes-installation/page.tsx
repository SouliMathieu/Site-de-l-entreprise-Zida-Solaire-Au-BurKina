import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";


export default async function AdminInstallationRequestsPage() {
  const requests = await prisma.installationRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container-zida flex-1 py-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Demandes d’installation
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Dernières demandes de devis installation reçues via le site.
        </p>

        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Référence</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Client</th>
                <th className="px-3 py-2">Téléphone</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-3 py-2 font-mono text-[11px]">
                    {r.requestNumber}
                  </td>
                  <td className="px-3 py-2">
                    {r.createdAt.toLocaleString("fr-FR")}
                  </td>
                  <td className="px-3 py-2">{r.customerName}</td>
                  <td className="px-3 py-2">{r.customerPhone}</td>
                  <td className="px-3 py-2">
                    {r.installationType === "SOLAR"
                      ? "Solaire"
                      : r.installationType === "ELECTRICAL"
                      ? "Électrique"
                      : "Autre"}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {r.status}
                  </td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-4 text-center text-sm text-slate-500"
                  >
                    Aucune demande pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}
