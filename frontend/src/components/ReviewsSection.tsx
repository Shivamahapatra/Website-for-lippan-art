import { prisma } from "@/lib/db";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export async function ReviewsSection() {
  // Fetch up to 10 latest reviews
  const reviews = await prisma.review.findMany({
    orderBy: { created_at: 'desc' },
    take: 10,
    include: { product: true }
  });

  // If there are no reviews yet, hide the section entirely
  if (reviews.length === 0) {
    return null;
  }

  const testimonials = reviews.map(r => ({
    quote: r.text,
    name: r.reviewer_name,
    // We use the designation field to show what product they bought and their rating
    designation: `${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)} • Bought ${r.product.name}`,
    // Generate a nice avatar based on their name
    src: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.reviewer_name)}&background=random&color=fff&size=512&rounded=false&font-size=0.33`
  }));

  return (
    <section className="w-full py-24 bg-card/30 border-y border-foreground/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 uppercase tracking-wider">
          Client Reviews
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          What Our Clients Say
        </h2>
        <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
          Real stories from customers who have brought the magic of Lippan Art into their modern spaces.
        </p>
      </div>
      
      <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
    </section>
  );
}
