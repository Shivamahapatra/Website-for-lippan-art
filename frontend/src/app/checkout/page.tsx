"use client";

import { useCartStore } from "@/store/useCartStore";
import { CheckoutForm } from "@/components/CheckoutForm";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total = items.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-background py-24 px-6 relative">
      {/* Aurora Blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-[128px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
            Secure Checkout
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-2xl font-bold">Order Summary</h2>
            <div className="flex flex-col gap-4">
              {items.length === 0 ? (
                <div className="p-8 bg-card rounded-2xl border border-foreground/5 text-center text-foreground/50">
                  Your cart is empty.
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 bg-card rounded-2xl border border-foreground/5 shadow-sm items-center"
                  >
                    <div className="w-16 h-16 bg-muted rounded-xl overflow-hidden shrink-0">
                      <img
                        src={item.product.image_base64 || (item.product.image_paths?.startsWith('http') ? item.product.image_paths.split(',')[0] : '/placeholder.jpg')}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold line-clamp-1">{item.product.name}</h3>
                      <p className="text-sm text-foreground/50">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-primary">
                      ₹{Number(item.product.price) * item.quantity}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {items.length > 0 && (
              <div className="p-6 bg-card rounded-2xl border border-foreground/5 shadow-sm mt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total to Pay</span>
                  <span className="text-primary text-2xl">₹{total}</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CheckoutForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
