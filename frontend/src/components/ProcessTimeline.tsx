"use client";

import React from "react";
import { Timeline } from "@/components/ui/timeline";

export function ProcessTimeline() {
  const data = [
    {
      title: "Step 1: The Base",
      content: (
        <div>
          <p className="text-foreground/80 text-sm md:text-base font-normal mb-8">
            The foundation of every authentic Lippan masterpiece begins with a sturdy canvas. Traditionally, artisans used 
            local Kutch clay mixed with camel dung to create an insect-repellent base. Today, we utilize modern, durable 
            equivalents that honor the traditional texture while ensuring your artwork lasts a lifetime without crumbling.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1618220179428-22790b46a0eb?q=80&w=800&auto=format&fit=crop"
              alt="Mixing clay"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-md"
            />
            <img
              src="https://images.unsplash.com/photo-1590273089301-447b85cf94da?q=80&w=800&auto=format&fit=crop"
              alt="Preparing base"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-md"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 2: Mud Relief",
      content: (
        <div>
          <p className="text-foreground/80 text-sm md:text-base font-normal mb-8">
            This is where the magic happens. The clay dough is hand-rolled into incredibly thin threads. These delicate 
            strands are carefully pinched, shaped, and pressed onto the base to form intricate geometric patterns, 
            intricate borders, and traditional motifs inspired by the desert landscape.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <img
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200&auto=format&fit=crop"
              alt="Mud relief work"
              className="rounded-lg object-cover h-40 md:h-64 lg:h-80 w-full shadow-md"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 3: Mirror Setting",
      content: (
        <div>
          <p className="text-foreground/80 text-sm md:text-base font-normal mb-8">
            Known as 'Abhla', the mirror setting is the soul of Lippan Art. Tiny, specially cut mirrors of various shapes 
            (diamonds, circles, triangles) are meticulously embedded into the wet clay. Historically, this was done to 
            reflect the faint light of oil lamps and illuminate the dark interiors of mud huts in Gujarat.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1601662528567-526cd06f6582?q=80&w=800&auto=format&fit=crop"
              alt="Setting mirrors"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-md"
            />
            <img
              src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800&auto=format&fit=crop"
              alt="Mirror details"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-md"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 4: Painting",
      content: (
        <div>
          <p className="text-foreground/80 text-sm md:text-base font-normal mb-8">
            Once the mud relief has completely dried, the artwork is painted. The classic look uses a stark, bright white 
            clay wash, though modern variations incorporate vibrant colors. Finally, a protective sealant is applied 
            to protect the delicate mud work and keep the mirrors shining bright.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <img
              src="https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=1200&auto=format&fit=crop"
              alt="Final painted piece"
              className="rounded-lg object-cover h-40 md:h-64 lg:h-80 w-full shadow-md"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div id="process" className="w-full bg-background font-sans border-y border-foreground/5 py-12">
      <Timeline 
        data={data} 
        title="The Artistic Process"
        description="A step-by-step look at how each authentic Lippan masterpiece is crafted from raw mud to a mirrored vision."
      />
    </div>
  );
}
