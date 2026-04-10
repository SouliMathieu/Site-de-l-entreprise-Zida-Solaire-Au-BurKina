// app/admin/layout.tsx
import { AdminNav } from "@/components/admin/AdminNav";
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata = {
  title: "Admin - ZIDA SOLAIRE",
  description: "Panel d'administration ZIDA SOLAIRE",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
