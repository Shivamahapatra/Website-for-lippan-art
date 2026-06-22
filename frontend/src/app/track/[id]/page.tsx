import { getOrdersByEmail, getOrderByTrackingId, STAGES } from "@/actions/orders";
import { BuyAgainButton } from "@/components/BuyAgainButton";
import { CheckCircle2, Clock, MapPin, Package, AlertCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function Timeline({ currentStatus }: { currentStatus: string }) {
  const currentIndex = STAGES.indexOf(currentStatus);
  
  return (
    <div className="relative flex flex-col md:flex-row justify-between w-full mt-10 mb-8">
      {STAGES.map((stage, idx) => {
        const isCompleted = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        const isFuture = idx > currentIndex;

        return (
          <div key={stage} className="relative flex flex-col items-center flex-1 z-10 mb-8 md:mb-0">
            {/* Connecting line */}
            {idx !== STAGES.length - 1 && (
              <div className={`absolute top-5 left-1/2 w-full h-1 hidden md:block ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
            )}
            
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 relative z-10 bg-background ${isCompleted ? 'border-primary text-primary' : isCurrent ? 'border-accent text-accent shadow-[0_0_15px_rgba(var(--accent),0.5)]' : 'border-muted text-muted-foreground'}`}>
              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-3 h-3 rounded-full bg-current" />}
            </div>
            
            <div className="mt-4 text-center">
              <p className={`text-sm font-bold ${isCurrent ? 'text-accent' : isCompleted ? 'text-foreground' : 'text-foreground/50'}`}>
                {stage}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default async function TrackDetailsPage({ params }: { params: { id: string } }) {
  const query = decodeURIComponent(params.id).trim();
  const isEmail = query.includes("@");

  if (isEmail) {
    const orders = await getOrdersByEmail(query);

    if (!orders || orders.length === 0) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
          <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold mb-2">No Orders Found</h1>
          <p className="text-foreground/70 mb-6">We couldn't find any orders linked to {query}.</p>
          <Link href="/track" className="text-primary hover:underline font-bold">Try another email or Tracking ID &rarr;</Link>
        </div>
      );
    }

    return (
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        <h1 className="text-4xl font-bold mb-2">Order History</h1>
        <p className="text-foreground/70 mb-10">Viewing orders for {query}</p>

        <div className="flex flex-col gap-6">
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
                  {order.items.map(item => (
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
                  <BuyAgainButton items={order.items as any} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle Tracking ID
  const order = await getOrderByTrackingId(query);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold mb-2">Invalid Tracking ID</h1>
        <p className="text-foreground/70 mb-6">We couldn't find an order with Tracking ID: {query}.</p>
        <Link href="/track" className="text-primary hover:underline font-bold">Try again &rarr;</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Order Status</h1>
        <p className="text-foreground/70 text-lg font-mono tracking-widest">{order.tracking_id}</p>
      </div>

      <div className="bg-card p-8 md:p-12 rounded-3xl border border-foreground/5 shadow-2xl relative overflow-hidden">
        {/* Aceternity Glow Effect inside card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-primary/5 blur-[100px] -z-10 pointer-events-none" />

        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">Hello, {order.customer_name}!</h2>
            <p className="text-foreground/60">Here is the current progress of your artwork.</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-sm text-foreground/50">Order Date</p>
            <p className="font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <Timeline currentStatus={order.status} />

        {order.status === "Ready for Pickup" && (
          <div className="mt-12 bg-green-500/10 border border-green-500/20 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-500 mb-2">It's Ready!</h3>
              <p className="text-foreground/80 mb-2">Your beautiful artwork is ready for pickup at our studio.</p>
              <p className="text-sm text-foreground/60 flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>F401 Innovative Aqua Front, 403, Vibhutipura Extension, Doddanekkundi, Bengaluru, Karnataka 560037</span>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 bg-card border border-foreground/5 p-8 rounded-3xl shadow-xl">
        <h3 className="text-xl font-bold mb-6">Order Summary</h3>
        <div className="flex flex-col gap-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center pb-4 border-b border-foreground/5 last:border-0 last:pb-0">
              <div className="flex items-center gap-4">
                <span className="font-bold text-muted-foreground bg-muted w-8 h-8 flex items-center justify-center rounded-lg">{item.quantity}</span>
                <div>
                  <p className="font-bold">{item.product.name}</p>
                  <p className="text-sm text-foreground/50">Size: {item.size}</p>
                </div>
              </div>
              <p className="font-bold text-lg">₹{item.price}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-foreground/10 flex justify-between items-center">
          <p className="text-lg text-foreground/60 font-bold uppercase tracking-widest">Total Paid</p>
          <p className="text-3xl font-bold text-primary">₹{order.total_amount}</p>
        </div>
      </div>
    </div>
  );
}
