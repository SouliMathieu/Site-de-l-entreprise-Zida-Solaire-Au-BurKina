// app/not-found.tsx
"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        {/* 404 */}
        <h1 className="text-9xl font-bold text-orange-500">404</h1>
        
        {/* Titre */}
        <h2 className="mt-4 text-3xl font-semibold text-slate-900">
          Page introuvable
        </h2>
        
        {/* Message */}
        <p className="mt-2 text-lg text-slate-600">
          Désolé, la page que vous recherchez n'existe pas.
        </p>

        {/* Boutons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
          >
            <Home className="h-5 w-5" />
            Retour à l'accueil
          </Link>
          
          <button
            onClick={handleGoBack}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft className="h-5 w-5" />
            Page précédente
          </button>
        </div>
      </div>
    </div>
  );
}
