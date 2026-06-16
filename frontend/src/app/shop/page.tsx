import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/ProductGrid";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      sizes: true,
      image_paths: true,
    },
    orderBy: { id: "desc" },
  });

  return (
    <main className="flex min-h-screen flex-col pt-24 px-4 md:px-8">
      <ProductGrid products={products as any} />
    </main>
  );
}
