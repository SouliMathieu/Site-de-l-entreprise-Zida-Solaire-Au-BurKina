// app/admin/dashboard/page.tsx
// Admin Dashboard avec KPIs

import { prisma } from "@/lib/prisma";
import { ArrowUp, Package, ShoppingCart, Users, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Dashboard | Admin ZIDA SOLAIRE",
  description: "Tableau de bord administration",
};

export default async function DashboardPage() {
  // Récupérer les stats
  const [
    totalOrders,
    totalProducts,
    totalCustomers,
    thisMonthOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.customer.count(),
    prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ]);

  // Revenue this month
  const thisMonthRevenue = await prisma.order.aggregate({
    where: {
      status: "DELIVERED",
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
    _sum: {
      total: true,
    },
  });

  // Recent orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { customer: true },
  });

  // Low stock products
  const lowStockProducts = await prisma.product.findMany({
    where: {
      stock: {
        lte: prisma.product.fields.lowStockThreshold,
      },
    },
    take: 5,
  });

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Total Commandes */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Commandes</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{totalOrders}</p>
            </div>
            <ShoppingCart className="w-12 h-12 text-orange-200" />
          </div>
        </div>

        {/* Commandes ce mois */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Ce mois</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{thisMonthOrders}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-200" />
          </div>
        </div>

        {/* Total Produits */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Produits</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{totalProducts}</p>
            </div>
            <Package className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        {/* Total Clients */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Clients</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{totalCustomers}</p>
            </div>
            <Users className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dernières Commandes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Dernières Commandes</h2>
          </div>
          <div className="divide-y">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-600">
                      {Number(order.total).toLocaleString("fr-FR")} FCFA
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{order.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Produits Rupture Stock */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Stock Faible</h2>
          </div>
          <div className="divide-y">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div key={product.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        product.stock === 0 ? "text-red-600" : "text-yellow-600"
                      }`}>
                        {product.stock} en stock
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-600">
                Aucun produit en rupture
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}