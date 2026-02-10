// components/layout/Footer.tsx
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Colonne 1: À propos */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-orange-500">
              ZIDA SOLAIRE
            </h3>
            <p className="mb-4 text-sm text-slate-300">
              Votre partenaire de confiance pour l'énergie solaire au Burkina
              Faso. Solutions complètes et professionnelles.
            </p>
            
            {/* Réseaux sociaux avec vraies couleurs */}
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg bg-[#1877F2] p-2.5 text-white transition-all hover:scale-110 hover:shadow-lg"
                aria-label="Facebook"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] p-2.5 text-white transition-all hover:scale-110 hover:shadow-lg"
                aria-label="Instagram"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Colonne 2: Liens rapides */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-300 transition-colors hover:text-orange-500"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/produits"
                  className="text-slate-300 transition-colors hover:text-orange-500"
                >
                  Produits
                </Link>
              </li>
              <li>
                <Link
                  href="/a-propos"
                  className="text-slate-300 transition-colors hover:text-orange-500"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-300 transition-colors hover:text-orange-500"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3: Services */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Nos services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/services"
                  className="text-slate-300 transition-colors hover:text-orange-500"
                >
                  Installation solaire
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-slate-300 transition-colors hover:text-orange-500"
                >
                  Maintenance & SAV
                </Link>
              </li>
              <li>
                <Link
                  href="/devis"
                  className="text-slate-300 transition-colors hover:text-orange-500"
                >
                  Demande de devis
                </Link>
              </li>
              <li>
                <Link
                  href="/demande-installation"
                  className="text-slate-300 transition-colors hover:text-orange-500"
                >
                  Demande d'installation
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4: Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />
                <a
                  href="tel:+22674339977"
                  className="text-slate-300 transition-colors hover:text-orange-500"
                >
                  +226 74 33 99 77
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />
                <a
                  href="mailto:Boubacarzida71@gmail.com"
                  className="text-slate-300 transition-colors hover:text-orange-500"
                >
                  contact@zidasolaire.bf
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />
                <span className="text-slate-300">
                  Ouagadougou, Burkina Faso
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
          <p>
            © {new Date().getFullYear()} ZIDA SOLAIRE. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
