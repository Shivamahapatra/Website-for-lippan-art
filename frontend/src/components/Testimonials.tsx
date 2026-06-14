"use client";

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const testimonials = [
  {
    quote: "The geometric Lippan mirror piece completely transformed my living room. The way the mirrors catch the afternoon sun is just breathtaking. Truly a masterpiece!",
    name: "Anya Sharma",
    designation: "Interior Designer",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    quote: "I commissioned a custom 4x4 feet piece for my entryway. Rasmita's attention to detail and the quality of the mud work exceeded all my expectations.",
    name: "Priya Desai",
    designation: "Art Collector",
    src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    quote: "Such a beautiful blend of traditional craft and modern minimalism. It's the first thing guests compliment when they walk into my home.",
    name: "Rahul Verma",
    designation: "Homeowner",
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    quote: "I was worried about shipping such delicate clay art, but it arrived perfectly packaged. The corrugated cardboard base makes it so easy to hang!",
    name: "Sarah Jenkins",
    designation: "Verified Buyer",
    src: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

export function Testimonials() {
  return (
    <section className="w-full py-24 bg-muted/30">
      <div className="text-center mb-10 px-6">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Loved by Collectors</h2>
        <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
          See how our handcrafted Lippan Art brings elegance and warmth to homes around the world.
        </p>
      </div>
      <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
    </section>
  );
}
