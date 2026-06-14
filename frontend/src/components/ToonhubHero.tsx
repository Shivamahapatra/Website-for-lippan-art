"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const IMAGES = [
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png', bg: '#F4845F', panel: '#F79B7F' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png', bg: '#6BBF7A', panel: '#85CC92' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', bg: '#E882B4', panel: '#ED9DC4' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png', bg: '#6EB5FF', panel: '#8DC4FF' },
];

export function ToonhubHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Preload images
    IMAGES.forEach((img) => {
      const image = new Image();
      image.src = img.src;
    });

    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navigate = useCallback((direction: "next" | "prev") => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setActiveIndex((prev) => {
      if (direction === "next") return (prev + 1) % 4;
      return (prev + 3) % 4;
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  }, [isAnimating]);

  const getRole = (index: number) => {
    if (index === activeIndex) return "center";
    if (index === (activeIndex + 3) % 4) return "left";
    if (index === (activeIndex + 1) % 4) return "right";
    return "back";
  };

  const getStyleForRole = (role: string) => {
    switch (role) {
      case "center":
        return {
          transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
          filter: "blur(0px)",
          opacity: 1,
          zIndex: 20,
          left: "50%",
          height: isMobile ? "60%" : "92%",
          bottom: isMobile ? "22%" : "0%",
        };
      case "left":
        return {
          transform: "translateX(-50%) scale(1)",
          filter: "blur(2px)",
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? "20%" : "30%",
          height: isMobile ? "16%" : "28%",
          bottom: isMobile ? "32%" : "12%",
        };
      case "right":
        return {
          transform: "translateX(-50%) scale(1)",
          filter: "blur(2px)",
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? "80%" : "70%",
          height: isMobile ? "16%" : "28%",
          bottom: isMobile ? "32%" : "12%",
        };
      case "back":
        return {
          transform: "translateX(-50%) scale(1)",
          filter: "blur(4px)",
          opacity: 1,
          zIndex: 5,
          left: "50%",
          height: isMobile ? "13%" : "22%",
          bottom: isMobile ? "32%" : "12%",
        };
      default:
        return {};
    }
  };

  const currentBg = IMAGES[activeIndex].bg;

  return (
    <div 
      className="relative w-full overflow-hidden font-sans"
      style={{
        backgroundColor: currentBg,
        transition: "background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div className="relative w-full overflow-hidden" style={{ height: "100vh" }}>
        
        {/* Grain overlay */}
        <div 
          className="absolute inset-0 pointer-events-none z-[50]"
          style={{
            opacity: 0.4,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            backgroundRepeat: "repeat"
          }}
        />

        {/* Ghost text */}
        <div 
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none z-[2]"
          style={{ top: "18%" }}
        >
          <span 
            className="font-black text-white uppercase tracking-[-0.02em] whitespace-nowrap leading-none font-anton"
            style={{ 
              fontSize: "clamp(90px, 28vw, 380px)",
              opacity: 1
            }}
          >
            3D SHAPE
          </span>
        </div>

        {/* Brand label */}
        <div className="absolute top-6 left-4 sm:left-8 z-[60] text-xs font-semibold uppercase text-white tracking-[0.18em] opacity-90">
          TOONHUB
        </div>

        {/* Carousel */}
        <div className="absolute inset-0 z-[3]">
          {IMAGES.map((img, index) => {
            const role = getRole(index);
            const style = getStyleForRole(role);
            return (
              <div
                key={index}
                className="absolute origin-bottom"
                style={{
                  aspectRatio: "0.6 / 1",
                  ...style,
                  transition: "transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1)",
                  willChange: "transform, filter, opacity"
                }}
              >
                <img
                  src={img.src}
                  alt={`Toonhub figurine ${index}`}
                  draggable={false}
                  className="w-full h-full object-contain object-bottom"
                />
              </div>
            );
          })}
        </div>

        {/* Bottom-left text + nav */}
        <div className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24 z-[60] max-w-[320px]">
          <p className="font-bold uppercase tracking-widest mb-2 sm:mb-3 text-base sm:text-[22px] text-white opacity-95 tracking-[0.02em]">
            TOONHUB FIGURINES
          </p>
          <p className="hidden sm:block text-sm text-white opacity-85 leading-[1.6] mb-5">
            The artwork is stunning, shipped fully prepared. The finish is a vision, the 3D craft is flawless. Many thanks! Wishing you the win. Order now.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('prev')}
              className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-transparent border-2 border-white text-white transition-all duration-150 hover:scale-[1.08] hover:bg-white/12"
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>
            <button
              onClick={() => navigate('next')}
              className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-transparent border-2 border-white text-white transition-all duration-150 hover:scale-[1.08] hover:bg-white/12"
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* Bottom-right link */}
        <a 
          href="#"
          className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10 z-[60] flex items-center gap-2 text-white opacity-95 hover:opacity-100 transition-opacity duration-200 uppercase no-underline font-anton"
          style={{
            fontSize: "clamp(20px, 4vw, 56px)",
            letterSpacing: "-0.02em",
            lineHeight: 1
          }}
        >
          DISCOVER IT
          <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} />
        </a>

      </div>
    </div>
  );
}
