// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZIDA SOLAIRE - Solutions solaires au Burkina Faso",
  description:
    "Vente et installation de solutions solaires et électriques au Burkina Faso.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
