"use client";

import { useCartStore } from "@/store/useCartStore";
import { Product } from "@prisma/client";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export function BuyAgainButton({ items }: { items: { product: Product, quantity: number }[] }) {
  const { addItem, toggleCart } = useCartStore();

  const handleBuyAgain = () => {
    // Add all items from this order back to the cart
    items.forEach((item) => {
      // Add the item `item.quantity` times to restore the exact order,
      // or just add it once for simplicity. The prompt says "Buy Again", so adding them back is good.
      for (let i = 0; i < item.quantity; i++) {
        addItem(item.product);
      }
    });
    // Open the cart
    if (!useCartStore.getState().isOpen) {
      toggleCart();
    }
  };

  return (
    <button 
      onClick={handleBuyAgain}
      className="flex items-center gap-2 bg-muted hover:bg-foreground/10 text-foreground px-4 py-2 rounded-xl font-bold transition-colors text-sm"
    >
      <ShoppingCart className="w-4 h-4" />
      Buy Again
    </button>
  );
}
