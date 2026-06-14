import { prisma } from "@/lib/db";
import { ReviewForm } from "@/components/ReviewForm";
import { redirect } from "next/navigation";

export default async function ReviewPage({ params }: { params: { tracking_id: string } }) {
  const order = await prisma.order.findUnique({
    where: { tracking_id: params.tracking_id },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  if (!order) {
    redirect("/");
  }

  // Ensure only completed orders can be reviewed to prevent abuse
  if (order.status !== "Completed & Picked Up") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">Too Early!</h1>
          <p className="text-foreground/70">
            You can only leave a review after your order has been completed and picked up. 
            We're working hard on your beautiful Lippan Art!
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center py-24 px-4">
      <div className="mb-12 text-center max-w-2xl">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
          Order: {order.tracking_id}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
          Hello {order.customer_name.split(' ')[0]}!
        </h1>
        <p className="text-lg text-foreground/70">
          Thank you for choosing Her Lippan Art. Please share your experience with the products you received.
        </p>
      </div>

      <div className="w-full">
        <ReviewForm trackingId={order.tracking_id} items={order.items} />
      </div>
    </main>
  );
}
