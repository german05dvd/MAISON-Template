import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((i) => i.id !== id)
            : state.items.map((i) =>
                i.id === id ? { ...i, quantity } : i
              ),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "maison-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const selectCartCount = (s: CartState) =>
  s.items.reduce((acc, i) => acc + i.quantity, 0);

export const selectCartTotal = (s: CartState) =>
  s.items.reduce((acc, i) => acc + i.priceNum * i.quantity, 0);

export const selectCartItems = (s: CartState) => s.items;

/**
 * SSR-safe hook: returns 0 on the server and during the first client render,
 * then hydrates to the real persisted value. Prevents hydration mismatches.
 */
export function useCartCount(): number {
  const [hydrated, setHydrated] = useState(false);
  const count = useCartStore(selectCartCount);
  useEffect(() => setHydrated(true), []);
  return hydrated ? count : 0;
}

export function useCartTotal(): number {
  const [hydrated, setHydrated] = useState(false);
  const total = useCartStore(selectCartTotal);
  useEffect(() => setHydrated(true), []);
  return hydrated ? total : 0;
}

export function useCartItems(): CartItem[] {
  const [hydrated, setHydrated] = useState(false);
  const items = useCartStore(selectCartItems);
  useEffect(() => setHydrated(true), []);
  return hydrated ? items : [];
}