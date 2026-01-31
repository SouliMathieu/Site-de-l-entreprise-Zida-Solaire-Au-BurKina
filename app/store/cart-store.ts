// store/cart-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image?: string | null;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalQuantity: number;
  totalAmount: number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.productId === item.productId);

        let newItems: CartItem[];
        if (existing) {
          newItems = items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        } else {
          newItems = [...items, { ...item, quantity }];
        }

        set({
          items: newItems,
          totalQuantity: newItems.reduce((sum, i) => sum + i.quantity, 0),
          totalAmount: newItems.reduce(
            (sum, i) => sum + i.quantity * i.price,
            0
          ),
        });
      },
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
      updateQuantity: (productId, quantity) => {
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
      clear: () => {
        set({ items: [], totalQuantity: 0, totalAmount: 0 });
      },
      totalQuantity: 0,
      totalAmount: 0,
    }),
    {
      name: "zida-cart",
    }
  )
);
