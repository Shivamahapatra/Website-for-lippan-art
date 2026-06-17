"use client";

import { motion } from "framer-motion";
import { CheckCircle2, MapPin, ExternalLink, Calendar, PackageCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const trackingId = searchParams.get("tracking") || "Pending";

  return (
    <>
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="mb-8"
        >
          <div className="w-32 h-32 bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Thank you for your purchase. Your order has been confirmed and is being prepared for pickup.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          
          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-foreground/5 p-8 rounded-3xl shadow-xl flex flex-col gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <PackageCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Order Details</h3>
                <p className="text-foreground/60">Keep this for your records</p>
              </div>
            </div>

            <div className="bg-muted p-6 rounded-2xl">
              <p className="text-sm font-medium text-foreground/50 uppercase tracking-widest mb-2">
                Tracking ID
              </p>
              <p className="text-3xl font-bold font-mono tracking-wider text-primary break-all">
                {trackingId}
              </p>
            </div>

            <p className="text-foreground/70 leading-relaxed">
              We have sent a detailed receipt and order confirmation to your email address. 
              Please present your Tracking ID and Name when you arrive to pick up your order.
            </p>
          </motion.div>

          {/* Pickup Instructions Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-foreground/5 p-8 rounded-3xl shadow-xl flex flex-col gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Pickup Instructions</h3>
                <p className="text-foreground/60">Where to collect your art</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-2xl border border-foreground/5">
                <Calendar className="w-5 h-5 text-foreground/50 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Store Hours</p>
                  <p className="text-foreground/60">Mon-Fri: 9:00 AM - 6:00 PM</p>
                  <p className="text-foreground/60">Sat: 10:00 AM - 4:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-2xl border border-foreground/5">
                <MapPin className="w-5 h-5 text-foreground/50 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Studio Location</p>
                  <p className="text-foreground/60">F401 Innovative Aqua Front, 403</p>
                  <p className="text-foreground/60">Vibhutipura Extension, Doddanekkundi</p>
                  <p className="text-foreground/60 mb-3">Bengaluru, Karnataka 560037</p>
                  
                  <a 
                    href="https://maps.app.goo.gl/4Nufp26ZGrZjBsYA7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent transition-colors"
                  >
                    Open in Google Maps <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background py-32 px-6 relative overflow-hidden">
      {/* Aurora Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[128px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[128px] pointer-events-none -z-10" />

      <Suspense fallback={<div className="flex items-center justify-center h-[60vh]"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
