"use server";

import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { sendReceiptEmail, sendReviewEmail, sendPickupEmail } from "@/lib/email";

export const STAGES = [
  "Order Received",
  "Prepping Board",
  "Clay & Mirror Work",
  "Drying",
  "Ready for Pickup",
  "Completed & Picked Up",
];

async function verifyAdminServerAction() {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  
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

    if (nextStatus === "Ready for Pickup") {
      await sendPickupEmail(order.email, order.customer_name, order.tracking_id);
    }
    
    if (nextStatus === "Completed & Picked Up") {
      await sendReviewEmail(order.email, order.customer_name, order.tracking_id);
    }

    revalidatePath("/admin/orders");
    return { success: true, newStatus: nextStatus };
  }

  return { success: false, error: "Order is already at the final stage" };
}

export async function setOrderStatus(orderId: number, newStatus: string) {
  await verifyAdminServerAction();

  if (!STAGES.includes(newStatus)) {
    throw new Error("Invalid status");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new Error("Order not found");

  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  if (newStatus === "Ready for Pickup" && order.status !== "Ready for Pickup") {
    await sendPickupEmail(order.email, order.customer_name, order.tracking_id);
  }

  if (newStatus === "Completed & Picked Up" && order.status !== "Completed & Picked Up") {
    await sendReviewEmail(order.email, order.customer_name, order.tracking_id);
  }

  revalidatePath("/admin/orders");
  return { success: true, newStatus };
}

export async function getOrdersByEmail(email: string) {
  const orders = await prisma.order.findMany({
    where: { email: email.toLowerCase() },
    orderBy: { created_at: "desc" },
    include: { items: { include: { product: true } } },
  });
  return orders;
}

export async function getOrderByTrackingId(trackingId: string) {
  const order = await prisma.order.findUnique({
    where: { tracking_id: trackingId },
    include: { items: { include: { product: true } } },
  });
  return order;
}
