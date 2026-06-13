"use server";

import Razorpay from "razorpay";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { sendReceiptEmail } from "@/lib/email";

// Initialize Razorpay SDK
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "test_key_id",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "test_key_secret",
});

export async function createRazorpayOrder(totalAmount: number) {
  const amountInPaise = Math.round(totalAmount * 100);

  if (amountInPaise < 100) {
    throw new Error("Amount too small");
  }

  const options = {
    amount: amountInPaise,
    currency: "INR",
    receipt: `receipt_${crypto.randomBytes(5).toString("hex")}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new Error("Failed to create payment order");
  }
}

export async function verifyAndSaveOrder(
  paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  },
  cartItems: any[],
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  }
) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

  // 1. Verify Signature Securely
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "test_key_secret")
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new Error("Invalid payment signature");
  }

  // 2. Save Order to Database via Prisma
  const total = cartItems.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );
  const trackingId = crypto.randomBytes(4).toString("hex").toUpperCase();

  const newOrder = await prisma.order.create({
    data: {
      customer_name: customerInfo.name,
      email: customerInfo.email,
      phone_number: customerInfo.phone,
      total_amount: total,
      tracking_id: trackingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      payment_status: "Paid",
      status: "Order Received",
      items: {
        create: cartItems.map((item) => ({
          product_id: item.product.id,
          size: "Standard", // Simplification as requested
          quantity: item.quantity,
          price: Number(item.product.price),
        })),
      },
    },
  });

  // 3. Send Email Receipt
  await sendReceiptEmail(
    customerInfo.email,
    customerInfo.name,
    trackingId,
    cartItems,
    total
  );

  return { success: true, trackingId };
}
