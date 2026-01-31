// components/common/WhatsAppButton.tsx
"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "+22674339977"; // mets ton vrai numéro ici

export function WhatsAppButton() {
  const message =
    "Bonjour ZIDA SOLAIRE, j'ai une question concernant vos produits et services.";

  const href = `https://wa.me/${WHATSAPP_NUMBER.replace(
    /[^0-9]/g,
    ""
  )}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#1ebe5a] transition"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
