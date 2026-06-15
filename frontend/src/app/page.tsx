import { Hero } from "@/components/Hero";
import { ProductNotchViewer } from "@/components/ProductNotchViewer";
import { CommissionForm } from "@/components/CommissionForm";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { AboutArtist } from "@/components/AboutArtist";
import { prisma } from "@/lib/db";

export default async function Home() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      sizes: true,
      image_paths: true,
    },
    orderBy: { id: 'desc' }
  });

  return (
    <main className="flex min-h-screen flex-col px-4 md:px-8">
      <Hero />
      <ProductNotchViewer products={products as any} />
      <Testimonials />
      <AboutArtist />
      <ProcessTimeline />
      <FAQ />
    </main>
  );
}
