"use client";

import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

const artisans = [
  {
    id: 1,
    name: "Aarav Sharma",
    designation: "Master Sculptor",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: 2,
    name: "Diya Patel",
    designation: "Mirror Art Specialist",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: 3,
    name: "Vikram Singh",
    designation: "Mud Artisan",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: 4,
    name: "Meera Reddy",
    designation: "Lead Designer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
];

export function Hero() {
  const FADE_DOWN_ANIMATION_VARIANTS: Variants = {
    hidden: { opacity: 0, y: -10, filter: "blur(10px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="relative w-full overflow-hidden flex min-h-[85vh] items-center justify-center bg-background">
      {/* Abstract Background Blur (Aceternity Style) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] opacity-50" />
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
        className="z-10 flex flex-col items-center text-center px-4 mt-12"
      >
        <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS} className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-card/50 backdrop-blur-md">
          <p className="text-sm font-medium text-primary tracking-wide uppercase">Handcrafted Elegance</p>
        </motion.div>
        
        <motion.h1
          variants={FADE_DOWN_ANIMATION_VARIANTS}
          className="text-5xl md:text-7xl font-bold tracking-tight text-foreground max-w-4xl"
        >
          Exquisite Lippan Art for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50">
            Modern Spaces
          </span>
        </motion.h1>

        <motion.p
          variants={FADE_DOWN_ANIMATION_VARIANTS}
          className="mt-6 text-lg md:text-xl text-foreground/70 max-w-2xl leading-relaxed"
        >
          Discover authentic, handcrafted mud and mirror work that perfectly balances deep tradition with minimalist elegance.
        </motion.p>

        <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS} className="mt-10 flex gap-4">
          <motion.button
            onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg shadow-lg shadow-primary/30",
              "transition-colors hover:bg-accent hover:text-accent-foreground"
            )}
          >
            Shop the Collection
          </motion.button>
          <motion.button
            onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-8 py-4 bg-transparent text-foreground rounded-full font-semibold text-lg border border-foreground/20 shadow-sm",
              "transition-colors hover:bg-foreground/5"
            )}
          >
            Learn the Process
          </motion.button>
        </motion.div>

        {/* Artisans Tooltip */}
        <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS} className="mt-20 flex flex-col items-center gap-4">
          <p className="text-sm font-medium text-foreground/50 uppercase tracking-widest">Meet Our Master Artisans</p>
          <div className="flex flex-row items-center justify-center mb-10 w-full">
            <AnimatedTooltip items={artisans} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
