import { BuyAgainButton } from "@/components/BuyAgainButton";
import Link from "next/link";

export function OrderHistoryList({ orders }: { orders: any[] }) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {orders.map((order) => (
        <div key={order.id} className="bg-card border border-foreground/5 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono bg-muted px-2 py-1 rounded text-sm text-foreground/70">{order.tracking_id}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${order.status === "Completed & Picked Up" ? "text-green-500 border-green-500/20 bg-green-500/10" : "text-primary border-primary/20 bg-primary/10"}`}>
                {order.status}
              </span>
            </div>
            <h3 className="text-lg font-bold">Order #{order.id}</h3>
            <p className="text-sm text-foreground/50">{new Date(order.created_at).toLocaleDateString()}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-foreground/70">
              {order.items.map((item: any) => (
                <span key={item.id} className="bg-muted px-3 py-1 rounded-full">{item.quantity}x {item.product.name}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-4 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-foreground/5">
            <p className="text-2xl font-bold">₹{order.total_amount}</p>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link href={`/track/${order.tracking_id}`} className="flex-1 md:flex-none text-center bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold hover:bg-accent transition-colors text-sm">
                View Tracker
              </Link>
              <BuyAgainButton items={order.items} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
