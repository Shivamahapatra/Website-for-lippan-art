"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Search, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@prisma/client";
import { useCartStore } from "@/store/useCartStore";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

type SortOption = "newest" | "price_asc" | "price_desc";

export function ProductGrid({ products }: { products: Product[] }) {
  const { addItem, toggleCart } = useCartStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const filteredAndSortedProducts = useMemo(() => {
    // 1. Filter
    let result = products.filter((p) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 2. Sort
    result = [...result].sort((a, b) => {
      if (sortBy === "price_asc") return Number(a.price) - Number(b.price);
      if (sortBy === "price_desc") return Number(b.price) - Number(a.price);
      // 'newest' uses default order (which is usually desc ID from DB)
      return 0;
    });

    return result;
  }, [products, searchQuery, sortBy]);

  return (
    <section id="shop" className="w-full py-24 px-4 sm:px-6 relative z-10 bg-background/50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 text-foreground">
            Full Collection
          </h2>
          <p className="text-foreground/60 max-w-2xl text-lg mb-12">
            Browse our complete catalog of handcrafted Lippan Art mirrors. Find the perfect masterpiece for your space.
          </p>

          {/* Filters & Sorting Bar */}
          <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center gap-4 bg-background border border-foreground/10 p-4 rounded-3xl shadow-sm">
            <div className="relative w-full flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input 
                type="text" 
                placeholder="Search artworks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-muted/50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground font-medium"
              />
            </div>
            <div className="relative w-full sm:w-auto shrink-0 flex items-center bg-muted/50 rounded-2xl border border-transparent focus-within:ring-2 focus-within:ring-primary/50 transition-all pr-4">
              <div className="pl-4 py-3 text-foreground/50 border-r border-foreground/10 mr-2 flex items-center gap-2 pointer-events-none">
                <ArrowUpDown className="w-4 h-4" />
                <span className="text-sm font-medium">Sort</span>
              </div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent outline-none py-3 text-foreground font-medium cursor-pointer appearance-none flex-1 pr-8"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </motion.div>

        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-bold text-foreground/50">No artworks found.</p>
            <p className="text-foreground/40 mt-2">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredAndSortedProducts.map((product) => (
              <motion.div 
                layout 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={product.id}
              >
                <CardContainer className="inter-var w-full">
                  <CardBody className="bg-card group/card w-full border border-foreground/5 rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-2xl transition-all h-full flex flex-col">
                    <CardItem translateZ="50" className="w-full relative aspect-square rounded-2xl overflow-hidden mb-6 bg-muted">
                      <img
                        src={(product as any).image_base64 || (product.image_paths?.startsWith('http') ? product.image_paths.split(',')[0] : `/api/products/${product.id}/image`)}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
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
                        className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-semibold py-3.5 px-4 rounded-xl transition-all group/btn"
                      >
                        <ShoppingCart className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                        Add to Cart
                      </button>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
