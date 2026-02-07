"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  FolderTree,
  LogOut,
} from "lucide-react";
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
        return;
      }
    } catch (error) {
      console.error("Erreur déconnexion:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="border-b border-orange-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo + nom */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md">
            <span className="text-lg font-bold">Z</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-gray-900">
              ZIDA SOLAIRE · Admin
            </p>
            <p className="text-xs text-gray-500">Gestion e‑commerce</p>
          </div>
        </div>

        {/* Navigation centrale */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-50 rounded-full px-1 py-1 border border-gray-100 shadow-sm">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Déconnexion */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-red-600 border border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-200 transition-all disabled:opacity-60"
        >
          <LogOut className="w-4 h-4" />
          <span>{isLoggingOut ? "Déconnexion..." : "Déconnexion"}</span>
        </button>
      </div>

      {/* Nav responsive (mobile) */}
      <nav className="md:hidden border-t border-gray-100 bg-white">
        <ul className="flex justify-around py-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center px-3 py-1 text-[11px] font-medium transition-colors ${
                    isActive ? "text-orange-600" : "text-gray-500"
                  }`}
                >
                  <Icon className="w-4 h-4 mb-0.5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
