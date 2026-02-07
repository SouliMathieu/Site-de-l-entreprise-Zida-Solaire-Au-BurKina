// app/admin/categories/nouvelle/page.tsx
import { CategoryFormClient } from "@/components/admin/CategoryFormClient";

export const metadata = {
  title: "Nouvelle catégorie | Admin ZIDA SOLAIRE",
  description: "Ajouter une nouvelle catégorie de produits.",
};

export default function NewCategoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <CategoryFormClient />
      </div>
    </div>
  );
}
