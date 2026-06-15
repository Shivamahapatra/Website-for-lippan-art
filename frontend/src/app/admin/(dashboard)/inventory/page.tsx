import { prisma } from "@/lib/db";
import { InventoryClient } from "./InventoryClient";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
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
    <div className="w-full h-full">
      <InventoryClient initialProducts={products as any} />
    </div>
  );
}
