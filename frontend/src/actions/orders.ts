"use server";

import { prisma } from "@/lib/db";
import { checkAdmin } from "./admin";
import { revalidatePath } from "next/cache";

const STAGES = [
  "Order Received",
  "Prepping Board",
  "Clay & Mirror Work",
  "Drying",
  "Ready for Pickup",
];

export async function advanceOrderStatus(orderId: number) {
  if (!(await checkAdmin())) throw new Error("Unauthorized");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });

  if (!order) throw new Error("Order not found");

  const currentIndex = STAGES.indexOf(order.status);
  
  if (currentIndex < STAGES.length - 1) {
    const nextStatus = STAGES[currentIndex + 1];
    
    await prisma.order.update({
      where: { id: orderId },
      data: { status: nextStatus },
    });

    // TODO: Trigger Ready for Pickup Email/SMS if nextStatus === "Ready for Pickup"

    revalidatePath("/admin/orders");
    return { success: true, newStatus: nextStatus };
  }

  return { success: false, error: "Order is already at the final stage" };
}
