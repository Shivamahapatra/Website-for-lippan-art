"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Product } from "@prisma/client";
import { useCartStore } from "@/store/useCartStore";

export function ProductGrid({ products }: { products: Product[] }) {
  const { addItem } = useCartStore();

  return (
    <section id="shop" className="w-full py-24 px-6 relative z-10 bg-background/50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-foreground">
            Shop the Collection
          </h2>
          <p className="text-foreground/60 max-w-2xl text-lg">
            Discover our latest handcrafted Lippan Art mirrors. Each piece is uniquely designed to bring warmth and elegance to your space.
          </p>
        </motion.div>

        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
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
                <img
                  src={product.image_base64 || (product.image_paths?.startsWith('http') ? product.image_paths.split(',')[0] : '/placeholder.jpg')}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <span className="font-bold text-lg text-primary">
                    ₹{product.price.toString()}
                  </span>
                </div>
                
                <p className="text-sm text-foreground/60 line-clamp-2 mb-6 flex-1">
                  {product.description}
                </p>

                <button 
                  onClick={() => addItem(product)}
                  className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-accent transition-colors flex items-center justify-center gap-2"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
