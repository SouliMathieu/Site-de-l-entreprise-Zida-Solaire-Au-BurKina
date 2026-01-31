"use client";

import { create } from "zustand";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  slug: string;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  hydrate: () => void;
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const CART_KEY = "zida-cart";

export const useCart = create<CartState>((set, get) => ({
  items: [],

  hydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(CART_KEY);
      const data: CartItem[] = raw ? JSON.parse(raw) : [];
      set({ items: data });
    } catch (e) {
      console.error("Erreur hydrate panier", e);
    }
  },

  addItem: (item) => {
    const items = [...get().items];
    const index = items.findIndex((i) => i.id === item.id);

    if (index >= 0) {
      items[index].quantity += item.quantity;
    } else {
      items.push(item);
    }

    localStorage.setItem(CART_KEY, JSON.stringify(items));
    set({ items });
  },

  updateQuantity: (id, quantity) => {
    let items = [...get().items];
    items = items.map((i) => (i.id === id ? { ...i, quantity } : i));
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    set({ items });
  },

  removeItem: (id) => {
    const items = get().items.filter((i) => i.id !== id);
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    set({ items });
  },

  clear: () => {
    localStorage.removeItem(CART_KEY);
    set({ items: [] });
  },
}));
