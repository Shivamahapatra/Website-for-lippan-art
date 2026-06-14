"use client";

import { IconBrandInstagram as Instagram } from "@tabler/icons-react";
import { motion } from "framer-motion";

export function AboutArtist() {
  return (
    <section className="w-full py-24 bg-background border-y border-foreground/5 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full md:w-1/2"
          >
            <div className="relative aspect-square max-w-sm mx-auto rounded-[3rem] overflow-hidden border-[12px] border-primary/5 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src="/rasmita.jpeg" 
                alt="Rasmita Mahapatra" 
                className="w-full h-full object-cover saturate-[0.8] hover:saturate-100 transition-all duration-500"
              />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full md:w-1/2 flex flex-col gap-6 text-center md:text-left"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm w-fit mx-auto md:mx-0 uppercase tracking-widest">
              Meet the Artist
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Rasmita Mahapatra
            </h2>
            
            <p className="text-lg text-foreground/80 leading-relaxed font-medium">
              Balancing the delicate, meticulous craft of traditional Lippan Art with a beautifully busy life. 
            </p>
            
            <p className="text-lg text-foreground/70 leading-relaxed">
              When she isn't rolling mud threads or setting mirrors, Rasmita is a dedicated mother of two and a passionate dance instructor who conducts lively dance classes for kids. 
            </p>

            <p className="text-lg text-foreground/70 leading-relaxed">
              Her artwork is deeply influenced by the rhythm of her dance classes and the warmth of her family. Every single piece is crafted by her hands, infused with a mother's love and a dancer's precision.
            </p>
            
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 mx-auto md:mx-0">
              <a 
                href="https://instagram.com/rasmita.mahapatra.35" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-pink-500/25"
              >
                <Instagram className="w-6 h-6" />
                Follow her journey
              </a>
              <span className="text-sm font-semibold text-foreground/50">
                @rasmita.mahapatra.35
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
