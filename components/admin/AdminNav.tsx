"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, FileText, FolderTree, LogOut } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/categories", label: "Catégories", icon: FolderTree },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingCart },
  { href: "/admin/devis", label: "Devis", icon: FileText },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/auth/signin");
        router.refresh();
      }
    } catch (error) {
      console.error("Erreur:", error);
      setIsLoggingOut(false);
    }
  }

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
          </button>
        </div>
      </div>
    </nav>
  );
}
