import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { prisma } from "@/lib/db";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { id: 'desc' }
  });

  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <ProductGrid products={products} />
    </main>
  );
}
