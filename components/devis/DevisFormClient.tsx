// components/devis/DevisFormClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "idle" | "submitting" | "success" | "error";

const INSTALLATION_TYPES = [
  { value: "SOLAR", label: "Installation solaire" },
  { value: "ELECTRICAL", label: "Installation électrique" },
  { value: "PLUMBING", label: "Plomberie" },
  { value: "OTHER", label: "Autre" },
];

export function DevisFormClient() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const formData = new FormData(event.currentTarget);

    const payload = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      type: formData.get("type") as string,
      description: formData.get("description") as string,
      preferredDate: formData.get("preferredDate") as string,
      preferredTime: formData.get("preferredTime") as string,
    };

    try {
      const res = await fetch("/api/installation-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Erreur serveur");
      }

      setStatus("success");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (e) {
      console.error(e);
      setError("Une erreur est survenue. Veuillez réessayer.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-lg font-semibold text-emerald-800">
          Demande envoyée avec succès !
        </p>
        <p className="mt-2 text-sm text-emerald-700">
          Nous vous contacterons très bientôt pour établir votre devis.
          Redirection vers l'accueil...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-slate-800"
          >
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-slate-800"
          >
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            required
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-slate-800"
          >
            Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-800"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label
            htmlFor="type"
            className="block text-sm font-medium text-slate-800"
          >
            Type d'installation <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            required
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            {INSTALLATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-slate-800"
          >
            Adresse du site
          </label>
          <input
            id="address"
            name="address"
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-800"
        >
          Description du projet <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          placeholder="Décrivez votre projet en détail..."
          className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label
            htmlFor="preferredDate"
            className="block text-sm font-medium text-slate-800"
          >
            Date souhaitée pour la visite
          </label>
          <input
            id="preferredDate"
            name="preferredDate"
            type="date"
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="preferredTime"
            className="block text-sm font-medium text-slate-800"
          >
            Heure souhaitée
          </label>
          <input
            id="preferredTime"
            name="preferredTime"
            type="time"
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Envoi en cours..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}
