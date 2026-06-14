"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How do I clean my Lippan Art piece?",
    answer: "Our Lippan Art pieces are sealed for durability. To clean, simply use a soft, dry microfiber cloth to gently wipe away dust. Avoid using wet cloths or harsh chemical cleaners, as they can damage the traditional mud base and dull the mirror shine.",
  },
  {
    question: "Are the pieces heavy?",
    answer: "Not at all! We use an upcycled, sturdy corrugated cardboard base instead of heavy wood. This makes the pieces incredibly lightweight and easy to hang on any wall using standard picture hooks or even strong double-sided tape.",
  },
  {
    question: "Can I hang it outdoors?",
    answer: "Lippan Art is traditionally meant for interior spaces. While they are sealed, prolonged exposure to direct rain or extreme outdoor humidity can warp the base and degrade the clay. We recommend keeping them in covered patios or indoors.",
  },
  {
    question: "Do you take custom commissions?",
    answer: "Absolutely! We love creating custom pieces tailored to your space. You can request specific dimensions, color palettes, and mirror patterns via our Commissions page. Lead times for custom work are typically 2-3 weeks.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full py-24 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Care & Maintenance</h2>
          <p className="text-foreground/70 text-lg">Everything you need to know about your new masterpiece.</p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={cn(
                  "border border-foreground/10 rounded-2xl overflow-hidden transition-colors",
                  isOpen ? "bg-muted/50" : "bg-card hover:bg-muted/30"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex items-center justify-between w-full p-6 text-left"
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  <ChevronDown 
                    className={cn(
                      "w-5 h-5 text-foreground/50 transition-transform duration-300", 
                      isOpen && "rotate-180"
                    )} 
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-foreground/70 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
