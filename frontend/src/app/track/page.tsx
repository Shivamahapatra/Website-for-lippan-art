import { currentUser } from "@clerk/nextjs/server";
import { getOrdersByEmail } from "@/actions/orders";
import { TrackSearchForm } from "@/components/TrackSearchForm";
import { OrderHistoryList } from "@/components/OrderHistoryList";

export const dynamic = "force-dynamic";

export default async function TrackPage() {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  let orders = [];
  if (email) {
    orders = await getOrdersByEmail(email);
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center p-6 bg-grid-white/[0.02]">
      {orders && orders.length > 0 ? (
        <div className="max-w-5xl mx-auto w-full py-12 md:py-20">
          <h1 className="text-4xl font-bold mb-2">Your Orders</h1>
          <p className="text-foreground/70 mb-10">Automatically showing orders for {email}</p>
          
          <OrderHistoryList orders={orders} />
          
          <div className="mt-32 flex flex-col items-center">
            <TrackSearchForm 
              title="Track Another Order" 
              subtitle="Looking for a specific order? Enter a Tracking ID or another Email Address below." 
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[60vh]">
          <TrackSearchForm />
        </div>
      )}
    </div>
  );
}
