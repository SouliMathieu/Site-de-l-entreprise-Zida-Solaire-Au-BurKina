// components/admin/ProductActionsClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye, AlertTriangle, X, Loader2, Info, ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";

interface ProductActionsClientProps {
  productId: string;
  productName: string;
  isActive: boolean;
  hasOrders: boolean;
}

export function ProductActionsClient({ 
  productId, 
  productName, 
  isActive,
  hasOrders 
}: ProductActionsClientProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleDelete() {
    setIsDeleting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      setSuccessMessage(data.message);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowDeleteModal(false);
      setTimeout(() => router.refresh(), 100);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setIsDeleting(false);
    }
  }

  async function handleToggleActive() {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
    }
  }

  // Afficher le message selon le contexte
  const getDeleteMessage = () => {
    if (!isActive && !hasOrders) {
      return {
        title: "Suppression définitive",
        description: "Ce produit inactif sera supprimé définitivement de la base de données.",
        warning: "⚠️ Cette action est irréversible. Le produit sera complètement supprimé.",
        color: "red"
      };
    }
    
    if (hasOrders) {
      return {
        title: "Désactivation du produit",
        description: `Ce produit est lié à des commandes et sera désactivé (non supprimé).`,
        warning: "ℹ️ Le produit reste en base pour l'historique des commandes mais ne sera plus visible sur le site.",
        color: "amber"
      };
    }

    return {
      title: "Suppression du produit",
      description: "Le produit sera supprimé.",
      warning: "⚠️ Cette action peut être irréversible.",
      color: "red"
    };
  };

  const deleteInfo = getDeleteMessage();

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        {/* Bouton Activer/Désactiver */}
        <button
          onClick={handleToggleActive}
          className={`group p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
            isActive 
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
              : 'bg-green-50 text-green-600 hover:bg-green-100'
          }`}
          title={isActive ? "Désactiver" : "Activer"}
        >
          {isActive ? (
            <ToggleRight className="w-4 h-4" />
          ) : (
            <ToggleLeft className="w-4 h-4" />
          )}
        </button>

        {/* Bouton Voir */}
        {isActive && (
          <Link
            href={`/produits/${productId}`}
            target="_blank"
            className="group p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 hover:scale-110"
            title="Voir sur le site"
          >
            <Eye className="w-4 h-4" />
          </Link>
        )}

        {/* Bouton Modifier */}
        <Link
          href={`/admin/produits/${productId}`}
          className="group p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all duration-200 hover:scale-110"
          title="Modifier"
        >
          <Edit className="w-4 h-4" />
        </Link>

        {/* Bouton Supprimer */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="group p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 hover:scale-110"
          title={!isActive && !hasOrders ? "Supprimer définitivement" : "Supprimer/Désactiver"}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Modale */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeleting && !successMessage) {
              setShowDeleteModal(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className={`p-6 text-white ${successMessage ? 'bg-gradient-to-r from-green-500 to-emerald-600' : `bg-gradient-to-r from-${deleteInfo.color}-500 to-${deleteInfo.color}-600`}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    {successMessage ? <Info className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {successMessage ? "Action effectuée" : deleteInfo.title}
                    </h3>
                    <p className="text-sm mt-1 opacity-90">
                      {successMessage ? "Opération réussie" : deleteInfo.description}
                    </p>
                  </div>
                </div>
                {!isDeleting && (
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              {successMessage ? (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">✅ {successMessage}</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-700 mb-4">
                    Voulez-vous vraiment {!isActive && !hasOrders ? "supprimer définitivement" : "supprimer"} le produit{" "}
                    <span className="font-bold text-gray-900">"{productName}"</span> ?
                  </p>
                  <div className={`bg-${deleteInfo.color}-50 border-l-4 border-${deleteInfo.color}-500 p-4 rounded-lg`}>
                    <p className={`text-sm text-${deleteInfo.color}-800 font-medium`}>
                      {deleteInfo.warning}
                    </p>
                  </div>
                </>
              )}

              {error && (
                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            {!successMessage && (
              <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`px-6 py-2 bg-gradient-to-r from-${deleteInfo.color}-500 to-${deleteInfo.color}-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center gap-2 min-w-[140px] justify-center`}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Suppression...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Confirmer</span>
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
