import { prisma } from "@/lib/db";
import { OrderStatusUpdater } from "@/components/OrderStatusUpdater";
import { ArrowRightCircle, CheckCircle2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { created_at: "desc" },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  const getStatusColor = (status: string) => {
    if (status === "Ready for Pickup" || status === "Completed & Picked Up") return "text-green-500 bg-green-500/10 border-green-500/20";
    if (status === "Order Received") return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    return "text-orange-500 bg-orange-500/10 border-orange-500/20";
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Order Tracking</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-card border border-foreground/5 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
            {/* Order Details */}
            <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-foreground/5 bg-muted/20">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-foreground/50 font-medium">Order #{order.id}</p>
                  <p className="text-sm text-foreground/50 font-mono mt-1 tracking-wider">{order.tracking_id}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                  {order.status}
                </div>
              </div>
              
              <h3 className="font-bold text-lg">{order.customer_name}</h3>
              <p className="text-sm text-foreground/70">{order.email}</p>
              <p className="text-sm text-foreground/70">{order.phone_number}</p>
              
              <div className="mt-6 pt-6 border-t border-foreground/5">
                <p className="text-xs text-foreground/50 uppercase font-bold tracking-widest mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-primary">₹{order.total_amount.toString()}</p>
                <p className="text-xs text-foreground/50 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-500" /> Razorpay: {order.razorpay_payment_id?.slice(0,8)}...
                </p>
              </div>
            </div>

            {/* Order Items & Actions */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-foreground/50 mb-4">Items</h4>
                <div className="flex flex-col gap-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <span className="font-medium bg-muted px-2 py-1 rounded-md">{item.quantity}x</span>
                        <span className="font-semibold">{item.product.name}</span>
                        <span className="text-foreground/50">({item.size})</span>
                      </div>
                      <span className="font-bold text-foreground/70">₹{item.price.toString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-foreground/5 flex justify-end">
                <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="p-12 text-center bg-card rounded-2xl border border-foreground/5 text-foreground/50 flex flex-col items-center gap-4">
            <Clock className="w-12 h-12 opacity-50" />
            <p>No orders received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
