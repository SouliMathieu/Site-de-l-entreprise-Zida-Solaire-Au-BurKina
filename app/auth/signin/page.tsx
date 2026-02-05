"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur de connexion");
        setLoading(false);
        return;
      }

      // Redirection vers admin
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("Erreur réseau");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">ZIDA SOLAIRE</h1>
          <p className="mt-2 text-sm text-slate-600">Connexion administrateur</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
