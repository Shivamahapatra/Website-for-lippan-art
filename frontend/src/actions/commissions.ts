"use server";

import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const COMMISSION_STAGES = [
  "New",
  "Contacted",
  "In Progress",
  "Completed",
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

export async function advanceCommissionStatus(commissionId: number) {
  await verifyAdminServerAction();

  const commission = await prisma.commission.findUnique({
    where: { id: commissionId },
  });

  if (!commission) throw new Error("Commission not found");

  const currentIndex = COMMISSION_STAGES.indexOf(commission.status);
  
  if (currentIndex === -1 || currentIndex === COMMISSION_STAGES.length - 1) {
    // If it's an unknown status, just reset it to Contacted. Otherwise it's already Completed.
    await prisma.commission.update({
      where: { id: commissionId },
      data: { status: "Contacted" },
    });
  } else {
    await prisma.commission.update({
      where: { id: commissionId },
      data: { status: COMMISSION_STAGES[currentIndex + 1] },
    });
  }

  revalidatePath("/admin/commissions");
}

export async function submitCommission(formData: FormData) {
  const customer_name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const size_requested = formData.get("size") as string;
  const details = formData.get("details") as string;

  if (!customer_name || !email || !details) {
    throw new Error("Missing required fields");
  }

  // Basic image handling (optional, just base64 for now if small enough)
  let reference_image_base64 = null;
  const image = formData.get("image") as File;
  if (image && image.size > 0) {
    // Convert to base64 if needed, keeping it simple for now
    const buffer = await image.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    reference_image_base64 = `data:${image.type};base64,${base64}`;
  }

  await prisma.commission.create({
    data: {
      customer_name,
      email,
      size_requested,
      details,
      reference_image_base64,
      status: "New",
    },
  });

  // Revalidate the admin dashboard so the new commission appears instantly
  revalidatePath("/admin/commissions");
  return { success: true };
}
