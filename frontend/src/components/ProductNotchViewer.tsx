"use client";

import React, { useState, useEffect } from "react";
import { Notch, type NotchItem } from "@/components/ui/notch";
import { cn } from "@/lib/utils";
import { Product } from "@prisma/client";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, Expand, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ProductNotchViewer({ products }: { products: Product[] }) {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id.toString());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    if (isHovered || isFullscreen || products.length <= 1) return;
    
    const interval = setInterval(() => {
      setSelectedProductId((prevId) => {
        const currentIndex = products.findIndex(p => p.id.toString() === prevId);
        const nextIndex = (currentIndex + 1) % products.length;
        return products[nextIndex].id.toString();
      });
    }, 3500); // Auto-advance every 3.5 seconds

    return () => clearInterval(interval);
  }, [isHovered, isFullscreen, products]);

  // Keyboard Hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setSelectedProductId((prevId) => {
          const currentIndex = products.findIndex(p => p.id.toString() === prevId);
          const nextIndex = (currentIndex + 1) % products.length;
          return products[nextIndex].id.toString();
        });
      } else if (e.key === "ArrowLeft") {
        setSelectedProductId((prevId) => {
          const currentIndex = products.findIndex(p => p.id.toString() === prevId);
          const nextIndex = (currentIndex - 1 + products.length) % products.length;
          return products[nextIndex].id.toString();
        });
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [products, isFullscreen]);

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
    <>
      <div id="shop" className="relative flex min-h-[80vh] w-full translate-z-0 items-center justify-center overflow-hidden rounded-[2.5rem] bg-background border border-foreground/5 [&_.fixed]:absolute shadow-xl my-12" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        
        {/* Playback Progress Bar */}
        <div className="absolute top-0 left-0 h-1.5 bg-foreground/5 w-full z-20 overflow-hidden">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes fillProgress {
              from { width: 0%; }
              to { width: 100%; }
            }
          `}} />
          <div 
            key={selectedProduct.id}
            className="h-full bg-primary"
            style={{ 
              animation: `fillProgress 3.5s linear forwards`,
              animationPlayState: (isHovered || isFullscreen) ? 'paused' : 'running'
            }}
          />
        </div>

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
                className="relative aspect-square w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-background/50 group cursor-pointer"
                onClick={() => setIsFullscreen(true)}
              >
                <img
                  src={(selectedProduct as any).image_base64 || (selectedProduct.image_paths?.startsWith('http') ? selectedProduct.image_paths.split(',')[0] : `/api/products/${selectedProduct.id}/image`)}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <Expand className="text-white w-12 h-12 drop-shadow-lg" />
                </div>
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

      {/* Full Section Pop-out Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 md:p-12">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-zoom-out"
              onClick={() => setIsFullscreen(false)}
            />
            
            {/* Pop-out Card */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-7xl max-h-[95vh] overflow-y-auto overflow-x-hidden bg-background rounded-[3rem] shadow-2xl z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16 p-8 md:p-16 border border-foreground/10"
            >
              {/* Dynamic Background Blur inside Modal */}
              <div className="absolute inset-0 z-0 overflow-hidden rounded-[3rem]">
                <img
                  src={(selectedProduct as any).image_base64 || (selectedProduct.image_paths?.startsWith('http') ? selectedProduct.image_paths.split(',')[0] : `/api/products/${selectedProduct.id}/image`)}
                  className="w-full h-full object-cover blur-[120px] scale-125 saturate-200 opacity-20"
                  alt="background blur"
                />
              </div>

              <button 
                className="absolute top-6 right-6 text-foreground/50 hover:text-foreground transition-all hover:scale-110 p-3 rounded-full bg-foreground/5 hover:bg-foreground/10 z-50 backdrop-blur-sm"
                onClick={() => setIsFullscreen(false)}
              >
                <X className="w-8 h-8" />
              </button>

              {/* Modal Image Container */}
              <div className="w-full md:w-1/2 flex justify-center relative z-10">
                <div className="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden shadow-2xl border-8 border-background/80">
                  <img
                    src={(selectedProduct as any).image_base64 || (selectedProduct.image_paths?.startsWith('http') ? selectedProduct.image_paths.split(',')[0] : `/api/products/${selectedProduct.id}/image`)}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Modal Product Details */}
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-6 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold w-fit mx-auto md:mx-0 border border-primary/20">
                  Lippan Masterpiece
                </div>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
                  {selectedProduct.name}
                </h2>
                <p className="text-3xl font-bold text-primary">
                  ₹{selectedProduct.price.toString()}
                </p>
                <p className="text-foreground/80 text-xl max-w-xl leading-relaxed font-medium">
                  {selectedProduct.description}
                </p>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => {
                      addItem(selectedProduct);
                      setIsFullscreen(false); // Close modal on add to cart
                    }}
                    className="flex items-center justify-center gap-3 bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-bold text-xl hover:bg-accent hover:scale-105 transition-all shadow-xl shadow-primary/30 w-full sm:w-auto"
                  >
                    <ShoppingBag className="w-7 h-7" />
                    Add to Cart Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
