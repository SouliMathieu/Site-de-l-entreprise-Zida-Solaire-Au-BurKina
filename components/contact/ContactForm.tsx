// components/contact/ContactForm.tsx
"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi");

      setIsSuccess(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-8 text-center shadow-lg">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-slate-900">
          Message envoyé avec succès !
        </h3>
        <p className="text-slate-600">
          Nous vous répondrons dans les plus brefs délais.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
            Nom complet *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
            Téléphone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        />
      </div>

      <div>
        <label htmlFor="subject" className="mb-1 block text-sm font-medium text-slate-700">
          Sujet *
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        >
          <option value="">Choisissez un sujet</option>
          <option value="devis">Demande de devis</option>
          <option value="produit">Information produit</option>
          <option value="installation">Installation</option>
          <option value="sav">Service après-vente</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-700">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 px-6 py-4 font-bold text-slate-900 shadow-lg transition-all hover:scale-105 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send className="h-5 w-5" />
        {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
      </button>
    </form>
  );
}
