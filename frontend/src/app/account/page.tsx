import { prisma } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Package, Award } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomerAccountPage() {
  const authObj = await auth();
  if (!authObj.userId) {
    redirect("/");
  }

  const user = await currentUser();

  const orders = await prisma.order.findMany({
    where: { clerk_user_id: authObj.userId },
    orderBy: { created_at: "desc" },
    include: { items: { include: { product: true } } },
  });

  const completedOrdersCount = orders.filter(o => o.payment_status === "Paid").length;
  const isLoyal = completedOrdersCount >= 5;
  const ordersNeeded = Math.max(0, 5 - completedOrdersCount);

  return (
    <div className="min-h-screen bg-background py-24 px-6 relative">
      {/* Aurora Blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <div className="flex items-center gap-6">
          <img 
            src={user?.imageUrl} 
            alt="Profile" 
            className="w-20 h-20 rounded-full border-4 border-card shadow-xl"
          />
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.firstName || "Customer"}!</h1>
            <p className="text-foreground/70">{user?.emailAddresses[0]?.emailAddress}</p>
          </div>
        </div>

        {/* Loyalty Tracker */}
        <div className="bg-card p-8 rounded-3xl border border-foreground/5 shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 opacity-5">
            <Award className="w-64 h-64" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
              <Award className="text-primary w-6 h-6" />
              Lippan Loyalty Program
            </h2>
            
            {isLoyal ? (
              <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 p-4 rounded-xl font-medium">
                🎉 Congratulations! You have achieved Loyal Customer status! A 20% discount will automatically be applied to all your future checkouts!
              </div>
            ) : (
              <div>
                <p className="text-foreground/70 mb-4">
                  You have made <strong>{completedOrdersCount}</strong> purchases. Make <strong>{ordersNeeded}</strong> more to unlock a permanent 20% discount on all future orders!
                </p>
                
                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(completedOrdersCount / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order History */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Package className="w-6 h-6" />
            Order History
          </h2>
          
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-card border border-foreground/5 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex justify-between mb-4">
                    <p className="text-sm font-medium text-foreground/50">Tracking: {order.tracking_id}</p>
                    <span className="text-sm font-bold px-3 py-1 bg-muted rounded-full">{order.status}</span>
                  </div>
                  
                  <div className="space-y-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex gap-4">
                        <img 
                          src={item.product.image_paths?.split(',')[0] || '/placeholder.jpg'} 
                          alt="" 
                          className="w-12 h-12 rounded-lg object-cover bg-muted"
                        />
                        <div>
                          <p className="font-semibold">{item.product.name}</p>
                          <p className="text-sm text-foreground/50">{item.quantity}x • ₹{item.price.toString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="md:border-l border-foreground/5 md:pl-6 flex flex-col justify-center shrink-0">
                  <p className="text-sm text-foreground/50 uppercase tracking-widest font-bold">Total Paid</p>
                  <p className="text-2xl font-bold text-primary">₹{order.total_amount.toString()}</p>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center p-12 text-foreground/50 bg-card rounded-2xl border border-foreground/5">
                You haven&apos;t made any purchases yet. Let&apos;s find you some beautiful art!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
