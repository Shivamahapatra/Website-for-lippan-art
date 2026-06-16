"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import Link from "next/link";

export function CartDrawer() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration errors with Zustand persist
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total = items.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-background border-l border-foreground/10 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-foreground/10 bg-white/50 dark:bg-black/50 backdrop-blur-md">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Your Cart
              </h2>
              <button
                onClick={toggleCart}
                className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-foreground/50 space-y-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p className="text-lg font-medium">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={item.product.id}
                    className="flex gap-4 bg-card rounded-2xl p-4 border border-foreground/5 shadow-sm bg-white dark:bg-zinc-900"
                  >
                    <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden shrink-0">
                      <img
                        src={(item.product as any).image_base64 || (item.product.image_paths?.startsWith('http') ? item.product.image_paths.split(',')[0] : `/api/products/${item.product.id}/image`)}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex flex-col flex-1 justify-between">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold line-clamp-1">{item.product.name}</h3>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-foreground/40 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-foreground/5 rounded-full px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-foreground/10 rounded-full transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-foreground/10 rounded-full transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-primary">₹{Number(item.product.price) * item.quantity}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-foreground/10 bg-white/50 dark:bg-black/50 backdrop-blur-md space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <Link href="/checkout" onClick={toggleCart} className="w-full py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:bg-accent transition-colors shadow-lg shadow-primary/20 flex justify-center items-center">
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
