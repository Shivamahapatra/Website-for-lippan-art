"use client";

import { useState } from "react";
import { submitCommission } from "@/actions/commissions";
import { Send, UploadCloud, CheckCircle2 } from "lucide-react";

export function CommissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    try {
      await submitCommission(formData);
      setIsSuccess(true);
      e.currentTarget.reset();
    } catch (error) {
      console.error(error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 p-12 rounded-3xl font-medium flex flex-col items-center gap-4 text-center">
        <CheckCircle2 className="w-16 h-16" />
        <h3 className="text-2xl font-bold">Request Sent Successfully!</h3>
        <p>Thank you for reaching out. We have received your custom Lippan Art commission request and will get back to you shortly.</p>
        <button onClick={() => setIsSuccess(false)} className="mt-4 font-bold hover:underline">Submit another request</button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-foreground/5 p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-2xl relative z-10">
        <h2 className="text-3xl font-bold tracking-tighter mb-2">Request a Custom Piece</h2>
        <p className="text-foreground/70 mb-8">Have a specific design, size, or color palette in mind? Tell us what you are looking for, and we will craft a bespoke Lippan Art masterpiece just for you.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground/80">Your Name *</label>
              <input required name="name" type="text" className="bg-background border border-foreground/10 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="John Doe" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground/80">Email Address *</label>
              <input required name="email" type="email" className="bg-background border border-foreground/10 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="john@example.com" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground/80">Desired Size</label>
            <input name="size" type="text" className="bg-background border border-foreground/10 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="e.g. 24x24 inches" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground/80">Design Details *</label>
            <textarea required name="details" rows={4} className="bg-background border border-foreground/10 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" placeholder="Describe the patterns, colors, and overall vision for your piece..." />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground/80">Reference Image (Optional)</label>
            <div className="relative flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-foreground/10 border-dashed rounded-xl cursor-pointer bg-background hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-foreground/50">
                  <UploadCloud className="w-8 h-8 mb-3" />
                  <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs">PNG, JPG or WEBP (MAX. 5MB)</p>
                </div>
                <input name="image" type="file" className="hidden" accept="image/*" />
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-4 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/25"
          >
            {isSubmitting ? "Sending Request..." : "Submit Commission Request"}
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
