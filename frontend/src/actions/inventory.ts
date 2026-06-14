"use server";

import { prisma } from "@/lib/db";
import { checkAdmin } from "./admin";
import { revalidatePath } from "next/cache";

export async function addProduct(data: {
  name: string;
  description: string;
  price: number;
  sizes: string;
  image_paths: string;
}) {
  if (!(await checkAdmin())) throw new Error("Unauthorized");
  
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
  if (!(await checkAdmin())) throw new Error("Unauthorized");
  
  await prisma.product.update({
    where: { id },
    data: { price: newPrice },
  });
  
  revalidatePath("/admin/inventory");
  revalidatePath("/");
  return { success: true };
}

export async function deleteProduct(id: number) {
  if (!(await checkAdmin())) throw new Error("Unauthorized");
  
  await prisma.product.delete({
    where: { id },
  });
  
  revalidatePath("/admin/inventory");
  revalidatePath("/");
  return { success: true };
}
