import { prisma } from "@/lib/db";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export async function ReviewsSection() {
  // Fetch up to 10 latest reviews
  const reviews = await prisma.review.findMany({
    orderBy: { created_at: 'desc' },
    take: 10,
    include: { product: true }
  });

  // If there are no reviews yet, we can either hide the section or show a dummy one.
  // For presentation purposes, let's provide a beautiful default testimonial if none exist.
  const fallbackTestimonials = [
    {
      quote: "The mirror work is absolutely stunning. It brought so much life and light to my living room! Highly recommended for anyone looking to add a touch of traditional elegance.",
      name: "Priya Sharma",
      designation: "Verified Buyer",
      src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
    },
    {
      quote: "I ordered a custom piece for my office and it exceeded all expectations. The mud work is flawless and feels incredibly authentic.",
      name: "Rahul Verma",
      designation: "Interior Designer",
      src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
    }
  ];

  const testimonials = reviews.length > 0 
    ? reviews.map(r => ({
        quote: r.text,
        name: r.reviewer_name,
        // We use the designation field to show what product they bought and their rating
        designation: `${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)} • Bought ${r.product.name}`,
        // Generate a nice avatar based on their name
        src: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.reviewer_name)}&background=random&color=fff&size=512&rounded=false&font-size=0.33`
      }))
    : fallbackTestimonials;

  return (
    <section className="w-full py-24 bg-card/30 border-y border-foreground/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 uppercase tracking-wider">
          Client Testimonials
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          What Our Clients Say
        </h2>
        <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
          Real stories from customers who have brought the magic of Lippan Art into their modern spaces.
        </p>
      </div>
      
      {/* 
        The AnimatedTestimonials is a client component that beautifully animates the images and text 
      */}
      <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
    </section>
  );
}
