// components/layout/Header.tsx
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20">
        {/* Logo + titre */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6B35] text-white font-bold">
            Z
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold uppercase tracking-wide">
              ZIDA SOLAIRE
            </span>
            <span className="text-xs text-slate-500">
              Solutions solaires & électriques
            </span>
          </div>
        </Link>

        {/* Menu principal */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 sm:flex">
          <Link href="/produits" className="hover:text-[#FF6B35]">
            Produits
          </Link>
          <Link href="/services" className="hover:text-[#FF6B35]">
            Services
          </Link>
          <Link href="/a-propos" className="hover:text-[#FF6B35]">
            À propos
          </Link>
          <Link href="/contact" className="hover:text-[#FF6B35]">
            Contact
          </Link>
          <Link href="/panier" className="hover:text-[#FF6B35]">
            Panier
          </Link>
        </nav>
      </div>
    </header>
  );
}
