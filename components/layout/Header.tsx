// components/layout/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-90 sm:gap-3"
          >
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14">
              <Image
                src="https://res.cloudinary.com/mathsoncloudinary/image/upload/v1770248853/Logo_hpz6qx.jpg"
                alt="ZIDA SOLAIRE Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-slate-900 sm:text-xl md:text-2xl">
                ZIDA SOLAIRE
              </h1>
              <p className="text-xs text-slate-600">Énergie & Solutions</p>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden items-center gap-4 md:flex lg:gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-slate-700 transition-colors hover:text-orange-500 lg:text-base"
            >
              Accueil
            </Link>
            <Link
              href="/produits"
              className="text-sm font-medium text-slate-700 transition-colors hover:text-orange-500 lg:text-base"
            >
              Produits
            </Link>
            <Link
              href="/a-propos"
              className="text-sm font-medium text-slate-700 transition-colors hover:text-orange-500 lg:text-base"
            >
              À propos
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-slate-700 transition-colors hover:text-orange-500 lg:text-base"
            >
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Téléphone Desktop */}
            <a
              href="tel:+22674339977"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-orange-500 transition-all hover:bg-orange-50 lg:flex"
            >
              <Phone className="h-5 w-5" />
              <span className="text-sm font-semibold">+226 74 33 99 77</span>
            </a>

            {/* Panier - BLANC VISIBLE */}
            <Link
              href="/panier"
              className="relative rounded-full bg-orange-500 p-2 text-white shadow-lg transition-all hover:scale-110 hover:bg-orange-600 sm:p-2.5"
              aria-label="Panier"
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-md">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Menu Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Mobile (Dropdown) */}
        {isMenuOpen && (
          <nav className="border-t bg-white py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-orange-50 hover:text-orange-500"
              >
                Accueil
              </Link>
              <Link
                href="/produits"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-orange-50 hover:text-orange-500"
              >
                Produits
              </Link>
              <Link
                href="/a-propos"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-orange-50 hover:text-orange-500"
              >
                À propos
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-orange-50 hover:text-orange-500"
              >
                Contact
              </Link>
              <a
                href="tel:+22674339977"
                className="flex items-center gap-2 rounded-lg border-t px-4 py-3 text-sm font-medium text-orange-500 transition-colors hover:bg-orange-50"
              >
                <Phone className="h-4 w-4" />
                +226 74 33 99 77
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
