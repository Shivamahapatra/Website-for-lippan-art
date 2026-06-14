import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { CommissionForm } from "@/components/CommissionForm";
import { prisma } from "@/lib/db";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { id: 'desc' }
  });

  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <div id="shop">
        <ProductGrid products={products} />
      </div>
      
      <div id="commission" className="max-w-7xl mx-auto w-full px-6 py-24">
        <CommissionForm />
      </div>
    </main>
  );
}
