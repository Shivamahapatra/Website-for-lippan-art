"use client";

import { useState } from "react";
import { Edit2, Trash2, Plus, X, Upload } from "lucide-react";
import { addProduct, updateProduct, deleteProduct } from "@/actions/inventory";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  sizes: string;
  image_paths: string;
  image_base64: string | null;
};

export function InventoryClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sizes: "",
    image_base64: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: "", description: "", price: "", sizes: "", image_base64: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      sizes: product.sizes,
      image_base64: product.image_base64 || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image_base64: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        const payload: any = {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          sizes: formData.sizes,
        };
        if (formData.image_base64 !== editingProduct.image_base64) {
          payload.image_base64 = formData.image_base64;
        }
        const res = await updateProduct(editingProduct.id, payload);
        if (!res.success) throw new Error(res.error);
        alert("Product updated successfully!");
      } else {
        const res = await addProduct({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          sizes: formData.sizes,
          image_base64: formData.image_base64,
        });
        if (!res.success) throw new Error(res.error);
        alert("Product added successfully!");
      }
      closeModal();
      window.location.reload(); // Quick refresh to get new server data
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await deleteProduct(id);
      if (res.success) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert("Failed to delete product: " + res.error);
      }
    } catch (err: any) {
      alert("Error deleting product.");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold hover:bg-accent transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="bg-card border border-foreground/5 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
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
                    <button 
                      onClick={() => openEditModal(product)}
                      className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" 
                      title="Edit Product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" 
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
          <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl border border-foreground/10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-foreground/5">
              <h2 className="text-xl font-bold">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={closeModal} className="p-2 rounded-full hover:bg-foreground/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold mb-1">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-foreground/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="e.g. Geometric Lippan Mandala"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-foreground/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-[100px]"
                  placeholder="Describe the product..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-foreground/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="e.g. 3500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Sizes</label>
                  <input 
                    type="text" 
                    required
                    value={formData.sizes}
                    onChange={e => setFormData({...formData, sizes: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-foreground/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="e.g. 12x12, 18x18"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Product Image</label>
                <div className="flex items-center gap-4">
                  {formData.image_base64 && (
                    <img 
                      src={formData.image_base64} 
                      alt="Preview" 
                      className="w-16 h-16 rounded-lg object-cover border border-foreground/10"
                    />
                  )}
                  <label className="flex items-center gap-2 cursor-pointer bg-muted px-4 py-2 rounded-xl text-sm font-semibold hover:bg-muted/80 transition-colors">
                    <Upload className="w-4 h-4" />
                    Upload Image
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                    />
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-6 py-3 rounded-xl font-bold bg-muted hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
