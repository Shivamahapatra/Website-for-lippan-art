"use client";

import React, { useState } from "react";
import { Notch, type NotchItem } from "@/components/ui/notch";
import { cn } from "@/lib/utils";
import { Product } from "@prisma/client";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ProductNotchViewer({ products }: { products: Product[] }) {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id.toString());
  const { addItem } = useCartStore();

  const items: NotchItem[] = [
    {
      id: "product-selector",
      label: "Select Artwork",
      options: products.map(p => ({ 
        id: p.id.toString(), 
        label: p.name 
      })),
      value: selectedProductId,
      onChange: (id) => setSelectedProductId(id),
    }
  ];

  const selectedProduct = products.find(p => p.id.toString() === selectedProductId);

  if (!selectedProduct) return null;

  return (
    <div id="shop" className="relative flex min-h-[80vh] w-full translate-z-0 items-center justify-center overflow-hidden rounded-[2.5rem] bg-background border border-foreground/5 [&_.fixed]:absolute shadow-xl my-12">
      
      {/* Dynamic Background Blur */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedProduct.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            src={(selectedProduct as any).image_base64 || (selectedProduct.image_paths?.startsWith('http') ? selectedProduct.image_paths.split(',')[0] : `/api/products/${selectedProduct.id}/image`)}
            className="w-full h-full object-cover blur-[100px] scale-110 saturate-200"
          />
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 w-full max-w-6xl px-6 md:px-12 py-20 pb-32">
        {/* Image Container */}
        <div className="w-full md:w-1/2 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedProduct.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative aspect-square w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-background/50"
            >
              <img
                src={(selectedProduct as any).image_base64 || (selectedProduct.image_paths?.startsWith('http') ? selectedProduct.image_paths.split(',')[0] : `/api/products/${selectedProduct.id}/image`)}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${selectedProduct.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm w-fit mx-auto md:mx-0">
                Lippan Masterpiece
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
                {selectedProduct.name}
              </h2>
              <p className="text-xl md:text-2xl font-semibold text-primary">
                ₹{selectedProduct.price.toString()}
              </p>
              <p className="text-foreground/70 text-lg max-w-xl leading-relaxed">
                {selectedProduct.description}
              </p>
              
              <div className="mt-4">
                <button 
                  onClick={() => addItem(selectedProduct)}
                  className="flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold text-lg hover:bg-accent hover:scale-105 transition-all shadow-xl shadow-primary/25"
                >
                  <ShoppingBag className="w-6 h-6" />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Notch Navigation */}
      <Notch 
        items={items} 
        position="bottom" 
        accentColor="#db2777" // Pink/Primary accent
        showSelectedValue={true}
      />
    </div>
  );
}
