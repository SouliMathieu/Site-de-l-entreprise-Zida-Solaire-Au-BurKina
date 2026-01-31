// components/layout/Footer.tsx
export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-900 text-slate-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold">ZIDA SOLAIRE</h3>
          <p className="mt-2 text-sm text-slate-400">
            Votre partenaire en solutions solaires et électriques au Burkina Faso.
          </p>
        </div>
        <div className="text-sm text-slate-400">
          <p>Ouagadougou, Burkina Faso</p>
          <p>Tél: +226 55 22 03 03</p>
          <p>WhatsApp: +226 74 33 99 77</p>
        </div>
      </div>
      <div className="border-t border-slate-800 py-3 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} ZIDA SOLAIRE. Tous droits réservés.
      </div>
    </footer>
  );
}
