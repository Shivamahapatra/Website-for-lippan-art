"use server";

import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function verifyAdminServerAction() {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  
  const adminEmailsRaw = process.env.ADMIN_EMAILS || "";
  const adminEmails = adminEmailsRaw.split(',').map(e => e.trim().toLowerCase());
  
  if (!userEmail || !adminEmails.includes(userEmail.toLowerCase())) {
    throw new Error("Unauthorized Admin");
  }
}

export async function addProduct(data: {
  name: string;
  description: string;
  price: number;
  sizes: string;
  image_paths: string;
}) {
  await verifyAdminServerAction();
  
  await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      sizes: data.sizes,
      image_paths: data.image_paths,
    },
  });
  
  revalidatePath("/admin/inventory");
  revalidatePath("/");
  return { success: true };
}

export async function updateProductPrice(id: number, newPrice: number) {
  await verifyAdminServerAction();
  
  await prisma.product.update({
    where: { id },
    data: { price: newPrice },
  });
  
  revalidatePath("/admin/inventory");
  revalidatePath("/");
  return { success: true };
}

export async function deleteProduct(id: number) {
  await verifyAdminServerAction();
  
  await prisma.product.delete({
    where: { id },
  });
  
  revalidatePath("/admin/inventory");
  revalidatePath("/");
  return { success: true };
}
