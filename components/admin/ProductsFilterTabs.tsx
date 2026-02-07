// components/admin/ProductsFilterTabs.tsx
"use client";

import Link from "next/link";
import { CheckCircle2, XCircle, Package } from "lucide-react";

interface ProductsFilterTabsProps {
  currentStatut: string;
  stats: {
    total: number;
    actifs: number;
    inactifs: number;
  };
}

export function ProductsFilterTabs({ currentStatut, stats }: ProductsFilterTabsProps) {
  const tabs = [
    {
      value: "actif",
      label: "Actifs",
      count: stats.actifs,
      icon: CheckCircle2,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-500",
    },
    {
      value: "inactif",
      label: "Inactifs",
      count: stats.inactifs,
      icon: XCircle,
      color: "from-gray-400 to-gray-500",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      borderColor: "border-gray-400",
    },
    {
      value: "tous",
      label: "Tous",
      count: stats.total,
      icon: Package,
      color: "from-primary to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      borderColor: "border-primary",
    },
  ];

  return (
    <div className="mb-6">
      <div className="bg-white rounded-2xl shadow-lg p-2 inline-flex gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentStatut === tab.value;

          return (
            <Link
              key={tab.value}
              href={`/admin/produits?statut=${tab.value}`}
              className={`
                relative px-6 py-3 rounded-xl font-semibold transition-all duration-300
                ${isActive 
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105` 
                  : `${tab.bgColor} ${tab.textColor} hover:shadow-md hover:scale-102`
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                <span className={`
                  px-2.5 py-0.5 rounded-full text-xs font-bold
                  ${isActive ? 'bg-white/20' : 'bg-white shadow-sm'}
                `}>
                  {tab.count}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
