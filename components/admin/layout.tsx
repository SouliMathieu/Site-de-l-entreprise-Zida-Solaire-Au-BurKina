// app/admin/layout.tsx
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-orange-500">
            ZIDA SOLAIRE - Admin
          </h1>
        </div>
      </header>

      <AdminNav />

      <div className="py-6">{children}</div>
    </div>
  );
}
