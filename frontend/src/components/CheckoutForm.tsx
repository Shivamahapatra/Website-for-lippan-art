"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { createRazorpayOrder, verifyAndSaveOrder } from "@/actions/checkout";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";

export function CheckoutForm() {
  const { items, clearCart } = useCartStore();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [successTrackingId, setSuccessTrackingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalAmount = items.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await loadRazorpayScript();
    if (!res) {
      setError("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      // 1. Create order on server
      const orderData = await createRazorpayOrder(totalAmount);

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "test_key_id",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Lippan Art",
        description: "Test Transaction",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify on server
            const verifyRes = await verifyAndSaveOrder(
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              items,
              formData
            );

            if (verifyRes.success) {
              setSuccessTrackingId(verifyRes.trackingId);
              clearCart();
            }
          } catch (err: any) {
            setError(err.message || "Payment verification failed.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#8c5a45",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      setError(err.message || "Failed to initiate checkout");
    } finally {
      setLoading(false);
    }
  };

  if (successTrackingId) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-12 bg-card rounded-3xl border border-foreground/5 shadow-2xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
        >
          <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-4">Payment Successful!</h2>
        <p className="text-lg text-foreground/70 mb-8">
          Thank you for your order, {formData.name}. We've sent a receipt to {formData.email}.
        </p>
        <div className="bg-muted px-8 py-4 rounded-xl">
          <p className="text-sm font-medium text-foreground/50 uppercase tracking-widest mb-1">
            Tracking ID
          </p>
          <p className="text-3xl font-bold font-mono tracking-wider text-primary">
            {successTrackingId}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handlePayment} className="flex flex-col gap-6 bg-card p-8 rounded-3xl border border-foreground/5 shadow-xl">
      <h2 className="text-2xl font-bold">Contact Details</h2>
      
      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Full Name</label>
        <input
          required
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="px-4 py-3 rounded-xl border border-foreground/10 bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          placeholder="Jane Doe"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Email Address</label>
        <input
          required
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="px-4 py-3 rounded-xl border border-foreground/10 bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          placeholder="jane@example.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Phone Number</label>
        <input
          required
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="px-4 py-3 rounded-xl border border-foreground/10 bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          placeholder="+91 98765 43210"
        />
      </div>

      <button
        type="submit"
        disabled={loading || items.length === 0}
        className="w-full py-4 mt-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-accent transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Pay Securely"}
      </button>
    </form>
  );
}
