// store/cart-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Type pour un article dans le panier
export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image?: string | null;
  quantity: number;
};

// Type pour le state du store
type CartState = {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

// Création du store avec persistence
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // État initial
      items: [],
      totalQuantity: 0,
      totalAmount: 0,

      // Ajouter un article
      addItem: (item, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.productId === item.productId);

        let newItems: CartItem[];

        if (existing) {
          // Incrémenter la quantité si l'article existe
          newItems = items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        } else {
          // Ajouter un nouvel article
          newItems = [...items, { ...item, quantity }];
        }

        // Mettre à jour le state
        set({
          items: newItems,
          totalQuantity: newItems.reduce((sum, i) => sum + i.quantity, 0),
          totalAmount: newItems.reduce(
            (sum, i) => sum + i.quantity * i.price,
            0
          ),
        });
      },

      // Retirer un article
      removeItem: (productId) => {
        const newItems = get().items.filter((i) => i.productId !== productId);

        set({
          items: newItems,
          totalQuantity: newItems.reduce((sum, i) => sum + i.quantity, 0),
          totalAmount: newItems.reduce(
            (sum, i) => sum + i.quantity * i.price,
            0
          ),
        });
      },

      // Modifier la quantité
      updateQuantity: (productId, quantity) => {
        // Si quantité <= 0, supprimer l'article
        if (quantity <= 0) {
          const newItems = get().items.filter(
            (i) => i.productId !== productId
          );

          set({
            items: newItems,
            totalQuantity: newItems.reduce((sum, i) => sum + i.quantity, 0),
            totalAmount: newItems.reduce(
              (sum, i) => sum + i.quantity * i.price,
              0
            ),
          });
          return;
        }

        // Sinon, mettre à jour la quantité
        const newItems = get().items.map((i) =>
          i.productId === productId ? { ...i, quantity } : i
        );

        set({
          items: newItems,
          totalQuantity: newItems.reduce((sum, i) => sum + i.quantity, 0),
          totalAmount: newItems.reduce(
            (sum, i) => sum + i.quantity * i.price,
            0
          ),
        });
      },

      // Vider le panier
      clear: () => {
        set({ items: [], totalQuantity: 0, totalAmount: 0 });
      },
    }),
    {
      name: "zida-cart", // Nom du localStorage
    }
  )
);
