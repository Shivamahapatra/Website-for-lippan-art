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
  image_base64: string;
}) {
  await verifyAdminServerAction();
  
  await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      sizes: data.sizes,
      image_paths: "",
      image_base64: data.image_base64,
    },
  });
  
  revalidatePath("/admin/inventory");
  revalidatePath("/");
  return { success: true };
}

export async function updateProduct(id: number, data: {
  name: string;
  description: string;
  price: number;
  sizes: string;
  image_base64?: string;
}) {
  await verifyAdminServerAction();
  
  const updateData: any = {
    name: data.name,
    description: data.description,
    price: data.price,
    sizes: data.sizes,
  };

  if (data.image_base64) {
    updateData.image_base64 = data.image_base64;
  }
  
  await prisma.product.update({
    where: { id },
    data: updateData,
  });
  
  revalidatePath("/admin/inventory");
  revalidatePath("/");
  return { success: true };
}

export async function deleteProduct(id: number) {
  try {
    await verifyAdminServerAction();
    
    // First delete related foreign key records to prevent constraint errors
    await prisma.orderItem.deleteMany({
      where: { product_id: id }
    });
    
    await prisma.review.deleteMany({
      where: { product_id: id }
    });

    await prisma.product.delete({
      where: { id },
    });
    
    revalidatePath("/admin/inventory");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message || "Failed to delete product" };
  }
}
