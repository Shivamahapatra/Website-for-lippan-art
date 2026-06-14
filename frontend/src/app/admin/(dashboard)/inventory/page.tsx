import { prisma } from "@/lib/db";
import { deleteProduct, updateProductPrice } from "@/actions/inventory";
import { Edit2, Trash2, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const products = await prisma.product.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold hover:bg-accent transition-colors shadow-lg">
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="bg-card border border-foreground/5 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b border-foreground/5 text-foreground/70 text-sm">
            <tr>
              <th className="p-4 font-semibold">Image</th>
              <th className="p-4 font-semibold">Product Name</th>
              <th className="p-4 font-semibold">Sizes</th>
              <th className="p-4 font-semibold">Price (₹)</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/5">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                    <img 
                      src={product.image_base64 || (product.image_paths?.startsWith('http') ? product.image_paths.split(',')[0] : '/placeholder.jpg')} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4 text-foreground/70">{product.sizes}</td>
                <td className="p-4 font-bold text-primary">₹{product.price.toString()}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <form action={async () => {
                      "use server";
                      // Simple price updater for now
                      await updateProductPrice(product.id, Number(product.price) + 100);
                    }}>
                      <button className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="Bump Price by 100">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </form>
                    <form action={async () => {
                      "use server";
                      await deleteProduct(product.id);
                    }}>
                      <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete Product">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-foreground/50">
                  No products found. Add one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
