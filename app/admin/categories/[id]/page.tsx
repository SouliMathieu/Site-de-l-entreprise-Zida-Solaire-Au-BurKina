// app/admin/categories/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { CategoryFormClient } from "@/components/admin/CategoryFormClient";

interface AdminCategoryEditPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Modifier une catégorie | Admin ZIDA SOLAIRE",
  description: "Modifier une catégorie de produits.",
};

export default async function AdminCategoryEditPage({
  params,
}: AdminCategoryEditPageProps) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Catégorie introuvable
          </h1>
          <p className="text-gray-600 mb-4">
            La catégorie que vous essayez de modifier n’existe pas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <CategoryFormClient category={category} />
      </div>
    </div>
  );
}
