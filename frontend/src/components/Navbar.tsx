"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";

export function Navbar() {
  const { items, toggleCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-foreground/5 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tighter text-primary">Lippan Art</span>
        </div>

        <nav className="hidden md:flex gap-6 text-sm font-medium text-foreground/80">
          <a href="#" className="hover:text-primary transition-colors">Home</a>
          <a href="#shop" className="hover:text-primary transition-colors">Shop</a>
          <a href="#" className="hover:text-primary transition-colors">About Us</a>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </nav>

        <div className="flex items-center">
          <button
            onClick={toggleCart}
            className="relative p-2 text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-foreground/5"
          >
            <ShoppingBag className="w-6 h-6" />
            {mounted && itemCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow-sm"
              >
                {itemCount}
              </motion.div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
