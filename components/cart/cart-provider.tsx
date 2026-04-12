"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { products } from "@/data/site";
import { canProductBePurchasedDirectly, getProductCartStatusMessage } from "@/lib/catalog";
import { buildCartSummary, CART_STORAGE_KEY, CartItem, parseStoredCart, sanitizeQuantity, StoredCartItem } from "@/lib/cart";
import { getCartDeliverySummary } from "@/lib/delivery";

type CartContextValue = {
  isHydrated: boolean;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  subtotalCount: number;
  canCheckout: boolean;
  invalidItemCount: number;
  deliverySummary: ReturnType<typeof getCartDeliverySummary>;
  addItem: (slug: string, quantity?: number) => { ok: boolean; message: string };
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [storedItems, setStoredItems] = useState<StoredCartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setStoredItems(parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY)));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(storedItems));
  }, [isHydrated, storedItems]);

  const summary = useMemo(() => buildCartSummary(storedItems), [storedItems]);

  const addItem = (slug: string, quantity = 1) => {
    const product = products.find((entry) => entry.slug === slug);

    if (!product) {
      return { ok: false, message: "Товар не найден в каталоге." };
    }

    if (!canProductBePurchasedDirectly(product)) {
      return { ok: false, message: getProductCartStatusMessage(product) };
    }

    setStoredItems((current) => {
      const existing = current.find((item) => item.slug === slug);

      if (existing) {
        return current.map((item) =>
          item.slug === slug ? { ...item, quantity: sanitizeQuantity(item.quantity + quantity) } : item
        );
      }

      return [...current, { slug, quantity: sanitizeQuantity(quantity) }];
    });

    return { ok: true, message: "Товар добавлен в корзину." };
  };

  const setQuantity = (slug: string, quantity: number) => {
    if (quantity <= 0) {
      setStoredItems((current) => current.filter((item) => item.slug !== slug));
      return;
    }

    setStoredItems((current) =>
      current.map((item) => (item.slug === slug ? { ...item, quantity: sanitizeQuantity(quantity) } : item))
    );
  };

  const removeItem = (slug: string) => {
    setStoredItems((current) => current.filter((item) => item.slug !== slug));
  };

  const clearCart = () => {
    setStoredItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        isHydrated,
        items: summary.items,
        itemCount: summary.itemCount,
        subtotal: summary.subtotal,
        subtotalCount: summary.subtotalCount,
        canCheckout: summary.canCheckout,
        invalidItemCount: summary.invalidItems.length,
        deliverySummary: summary.deliverySummary,
        addItem,
        setQuantity,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
