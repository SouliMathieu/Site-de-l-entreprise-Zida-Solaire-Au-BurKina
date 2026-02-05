import { AdminNav } from "@/components/admin/AdminNav";

export const metadata = {
  title: "Admin - ZIDA SOLAIRE",
  description: "Panel d'administration",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
