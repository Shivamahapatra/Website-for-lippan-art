"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-primary to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-accent to-transparent" />
    </>
  );
};

export function TrackSearchForm({ title = "Track Your Order", subtitle = "Enter your Tracking ID to see live updates on your artwork, or use your Email Address to view your entire order history." }: { title?: string, subtitle?: string }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/track/${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl w-full flex flex-col items-center text-center"
    >
      <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-foreground">
        {title}
      </h1>
      <p className="text-lg text-foreground/70 mb-10 max-w-md">
        {subtitle}
      </p>

      <form onSubmit={handleSearch} className="w-full bg-card p-6 md:p-8 rounded-3xl border border-foreground/5 shadow-xl relative overflow-hidden">
        {/* Subtle glow effect behind form */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[150%] bg-primary/5 rounded-[100%] blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col gap-4 relative z-10">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Email or Tracking ID..."
            className="text-lg py-5 px-6 rounded-2xl"
            required
          />

          <button
            type="submit"
            className="group/btn relative overflow-hidden w-full py-4 mt-2 bg-primary text-primary-foreground rounded-2xl font-bold text-lg hover:bg-accent transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Find My Order
            <BottomGradient />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
