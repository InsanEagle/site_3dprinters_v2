"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";

type AddToCartButtonProps = {
  slug: string;
  className?: string;
  label?: string;
};

export function AddToCartButton({ slug, className, label = "В корзину" }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setMessage(null);
      setStatus("idle");
    }, 2500);

    return () => window.clearTimeout(timeoutId);
  }, [message]);

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        data-testid={`add-to-cart-${slug}`}
        className={className}
        onClick={() => {
          const result = addItem(slug);
          setMessage(result.message);
          setStatus(result.ok ? "success" : "error");
        }}
      >
        {label}
      </Button>
      {message ? (
        <p data-testid={`add-to-cart-message-${slug}`} className={`text-sm ${status === "success" ? "text-accent" : "text-body"}`} aria-live="polite">
          {message}
        </p>
      ) : null}
    </div>
  );
}
