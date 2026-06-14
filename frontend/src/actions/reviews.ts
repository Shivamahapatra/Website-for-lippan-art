"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitReview(
  trackingId: string, 
  productId: number, 
  rating: number, 
  text: string
) {
  try {
    const order = await prisma.order.findUnique({
      where: { tracking_id: trackingId },
    });

    if (!order) {
      return { success: false, error: "Order not found." };
    }

    // Basic validation
    if (rating < 1 || rating > 5) {
      return { success: false, error: "Rating must be between 1 and 5." };
    }
    if (!text || text.trim().length < 5) {
      return { success: false, error: "Review must be at least 5 characters." };
    }

    await prisma.review.create({
      data: {
        product_id: productId,
        reviewer_name: order.customer_name,
        rating,
        text: text.trim(),
      }
    });

    revalidatePath("/");
    revalidatePath("/reviews");
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to submit review:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
