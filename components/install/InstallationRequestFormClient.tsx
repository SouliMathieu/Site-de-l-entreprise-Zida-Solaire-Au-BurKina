"use client";

import { useState } from "react";

type InstallationType = "SOLAR" | "ELECTRICAL" | "OTHER";

export function InstallationRequestFormClient() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<InstallationType>("SOLAR");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [successNumber, setSuccessNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!firstName || !lastName || !phone || !description) {
      setError("Nom, téléphone et description sont obligatoires.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/installation-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          email,
          type,
          address,
          description,
          preferredDate,
          preferredTime,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Erreur lors de l’envoi de la demande.");
      }

      const data = (await res.json()) as { requestNumber: string };
      setSuccessNumber(data.requestNumber);

      // reset simple
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setDescription("");
      setPreferredDate("");
      setPreferredTime("");
    } catch (err: any) {
      setError(err?.message || "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  if (successNumber) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-emerald-800">
          Merci, votre demande a bien été envoyée !
        </p>
        <p className="mt-2">
          Référence de la demande :{" "}
          <span className="font-mono font-semibold">
            {successNumber}
          </span>
        </p>
        <p className="mt-2">
          Nous vous contacterons rapidement pour discuter de votre projet.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Prénom *
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Nom *
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Téléphone (WhatsApp) *
          </label>
          <input
            type="tel"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-700">
          Type d’installation
        </label>
        <select
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={type}
          onChange={(e) => setType(e.target.value as InstallationType)}
        >
          <option value="SOLAR">Installation solaire</option>
          <option value="ELECTRICAL">Installation électrique</option>
          <option value="OTHER">Autre type</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-700">
          Adresse du site
        </label>
        <textarea
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          rows={2}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-700">
          Description du projet *
        </label>
        <textarea
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p className="mt-1 text-[11px] text-slate-500">
          Exemple: Nombre de pièces, consommation approximative, type de bâtiment, etc.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Date souhaitée
          </label>
          <input
            type="date"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Heure préférée
          </label>
          <input
            type="time"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-md bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#e85f2f] disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {loading ? "Envoi en cours..." : "Envoyer la demande"}
      </button>
    </form>
  );
}
