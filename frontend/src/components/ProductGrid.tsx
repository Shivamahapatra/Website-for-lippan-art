"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@prisma/client";
import { useCartStore } from "@/store/useCartStore";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

export function ProductGrid({ products }: { products: Product[] }) {
  const { addItem, toggleCart } = useCartStore();

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
            <CardContainer key={product.id} className="inter-var w-full">
              <CardBody className="bg-card group/card w-full border border-foreground/5 rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all h-full flex flex-col">
                <CardItem translateZ="50" className="w-full relative aspect-square rounded-2xl overflow-hidden mb-6 bg-muted">
                  <img
                    src={product.image_base64 || (product.image_paths?.startsWith('http') ? product.image_paths.split(',')[0] : '/placeholder.jpg')}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-foreground/10 text-xs font-bold shadow-sm">
                    In Stock
                  </div>
                </CardItem>
                
                <CardItem translateZ="30" className="flex-1">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="text-xl font-bold leading-tight">{product.name}</h3>
                    <span className="text-lg font-bold text-primary shrink-0">₹{product.price.toString()}</span>
                  </div>
                  <p className="text-foreground/60 text-sm mb-6 line-clamp-2">
                    {product.description}
                  </p>
                </CardItem>
                
                <CardItem translateZ="40" className="w-full">
                  <button 
                    onClick={() => {
                      addItem(product);
                      toggleCart();
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-muted hover:bg-primary hover:text-primary-foreground text-foreground font-semibold py-3.5 px-4 rounded-xl transition-colors group/btn"
                  >
                    <ShoppingCart className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                    Add to Cart
                  </button>
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
