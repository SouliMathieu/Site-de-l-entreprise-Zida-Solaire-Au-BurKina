// components/admin/DevisActionsClient.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, Trash2, Loader2, AlertTriangle, X } from "lucide-react";

interface Props {
  requestId: string;
  requestNumber: string;
}

export function DevisActionsClient({ requestId, requestNumber }: Props) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        `/api/admin/installation-requests/${requestId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la suppression.");
      }

      setSuccess(data.message || "Demande supprimée.");
      setTimeout(() => {
        setShowConfirm(false);
        router.refresh();
      }, 800);
    } catch (e: any) {
      setError(e.message || "Erreur inconnue.");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/devis/${requestId}`}
          className="text-xs font-semibold text-primary hover:text-orange-600 inline-flex items-center gap-1"
        >
          <Eye className="w-4 h-4" />
          Voir
        </Link>
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="text-xs font-semibold text-red-500 hover:text-red-600 inline-flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Supprimer
        </button>
      </div>

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !loading) {
              setShowConfirm(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2.5 rounded-xl">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">
                      Supprimer la demande de devis
                    </h2>
                    <p className="text-xs text-red-100">
                      Cette action est définitive.
                    </p>
                  </div>
                </div>
                {!loading && (
                  <button
                    type="button"
                    onClick={() => setShowConfirm(false)}
                    className="p-1 rounded-lg hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-5 space-y-4">
              {success ? (
                <div className="bg-green-50 border-l-4 border-green-500 px-4 py-3 rounded-lg text-sm text-green-800">
                  ✅ {success}
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-700">
                    Êtes-vous sûr de vouloir supprimer la demande{" "}
                    <span className="font-semibold text-gray-900">
                      {requestNumber}
                    </span>{" "}
                    ?
                  </p>
                  <div className="bg-red-50 border-l-4 border-red-500 px-4 py-3 rounded-lg text-sm text-red-800">
                    ⚠️ Toutes les informations associées seront définitivement
                    supprimées.
                  </div>
                </>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">
                  {error}
                </div>
              )}
            </div>

            {!success && (
              <div className="flex items-center justify-end gap-3 bg-gray-50 px-5 py-4">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-60"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-md hover:shadow-lg disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Suppression...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Confirmer
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
