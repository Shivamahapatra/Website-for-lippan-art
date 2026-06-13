"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Product } from "@prisma/client";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section id="shop" className="w-full max-w-7xl mx-auto py-24 px-6">
      <div className="flex flex-col items-center mb-16 text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-4">Featured Collection</h2>
        <p className="text-lg text-foreground/70 max-w-2xl">
          Each piece is meticulously handcrafted, ensuring no two artworks are exactly alike.
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            variants={{
              hidden: { opacity: 0, y: 50, scale: 0.95 },
              show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
            }}
            whileHover={{ y: -10, transition: { type: "spring" as const, stiffness: 300 } }}
            className="group relative flex flex-col bg-card rounded-2xl overflow-hidden border border-foreground/5 shadow-sm hover:shadow-xl transition-shadow bg-white dark:bg-zinc-900"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              {/* Fallback image logic similar to the old Python app */}
              <img
                src={product.image_base64 || (product.image_paths?.startsWith('http') ? product.image_paths.split(',')[0] : '/placeholder.jpg')}
                alt={product.name}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-foreground/70 line-clamp-2 text-sm mb-4">{product.description}</p>
              
              <div className="mt-auto flex items-center justify-between">
                <span className="text-lg font-bold text-primary">₹{product.price}</span>
                <button className="text-sm font-semibold px-4 py-2 bg-foreground/5 hover:bg-primary hover:text-white rounded-full transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
