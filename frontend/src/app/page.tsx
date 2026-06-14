import { ToonhubHero } from "@/components/ToonhubHero";
import { Hero } from "@/components/Hero";
import { ProductNotchViewer } from "@/components/ProductNotchViewer";
import { CommissionForm } from "@/components/CommissionForm";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { AboutArtist } from "@/components/AboutArtist";
import { prisma } from "@/lib/db";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { id: 'desc' }
  });

  return (
    <main className="flex min-h-screen flex-col">
      <ToonhubHero />
      <div className="px-4 md:px-8">
        <Hero />
      
      <AboutArtist />
      
      <ProductNotchViewer products={products} />
      
      <ReviewsSection />
      
      <ProcessTimeline />
      
      <div id="commission" className="max-w-7xl mx-auto w-full px-6 py-24">
        <CommissionForm />
      </div>
    </main>
  );
}
