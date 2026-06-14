import { checkAdmin, logoutAdmin } from "@/actions/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ShoppingCart, LogOut } from "lucide-react";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await checkAdmin();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-foreground/5 p-6 flex flex-col gap-8 hidden md:flex">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter text-primary">Admin Panel</h2>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <Link href="/admin/inventory" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted font-medium transition-colors">
            <Package className="w-5 h-5" />
            Inventory
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted font-medium transition-colors">
            <ShoppingCart className="w-5 h-5" />
            Orders
          </Link>
        </nav>

        <form action={logoutAdmin}>
          <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 rounded-xl hover:bg-red-500/10 font-medium transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-card border-b border-foreground/5 p-4 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
          <form action={logoutAdmin}>
            <button className="p-2 text-red-500 rounded-lg hover:bg-red-500/10">
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
