"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const STAGES = [
  "Order Received",
  "Prepping Board",
  "Clay & Mirror Work",
  "Drying",
  "Ready for Pickup",
];

async function verifyAdminServerAction() {
  const authObj = await auth();
  if (!authObj.userId) throw new Error("Unauthorized");
  
  const sessionClaims = authObj.sessionClaims as { email?: string } | null;
  const userEmail = sessionClaims?.email;
  
  const adminEmailsRaw = process.env.ADMIN_EMAILS || "";
  const adminEmails = adminEmailsRaw.split(',').map(e => e.trim().toLowerCase());
  
  if (!userEmail || !adminEmails.includes(userEmail.toLowerCase())) {
    throw new Error("Unauthorized Admin");
  }
}

export async function advanceOrderStatus(orderId: number) {
  await verifyAdminServerAction();

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
