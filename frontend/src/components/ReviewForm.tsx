"use client";

import { useState } from "react";
import { submitReview } from "@/actions/reviews";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function ReviewForm({ trackingId, items }: { trackingId: string, items: any[] }) {
  const [selectedProductId, setSelectedProductId] = useState<number>(items[0]?.product_id);
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center gap-6">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center border-4 border-green-500">
          <Star className="w-10 h-10 fill-current" />
        </div>
        <h2 className="text-3xl font-bold">Thank You!</h2>
        <p className="text-foreground/70 max-w-md">
          Your review has been successfully submitted. We deeply appreciate your support for traditional Lippan Art!
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold transition-transform hover:scale-105"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const res = await submitReview(trackingId, selectedProductId, rating, text);
    
    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || "An error occurred.");
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-xl mx-auto w-full p-8 bg-card rounded-3xl shadow-xl border border-foreground/5">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-foreground">Leave a Review</h2>
        <p className="text-foreground/60">We'd love to hear your thoughts on your new artwork.</p>
      </div>

      {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg font-semibold">{error}</div>}

      <div className="flex flex-col gap-2">
        <label className="font-semibold text-sm uppercase tracking-wider text-foreground/80">Select Product</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedProductId(item.product_id)}
              className={cn(
                "flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all",
                selectedProductId === item.product_id 
                  ? "border-primary bg-primary/5 ring-1 ring-primary" 
                  : "border-border hover:border-foreground/30 hover:bg-foreground/5"
              )}
            >
              <img 
                src={item.product.image_base64 || (item.product.image_paths?.startsWith('http') ? item.product.image_paths.split(',')[0] : '/placeholder.jpg')}
                alt={item.product.name}
                className="w-12 h-12 rounded-md object-cover"
              />
              <span className="font-medium text-sm line-clamp-2">{item.product.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 items-center py-6">
        <label className="font-semibold text-sm uppercase tracking-wider text-foreground/80 mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="p-1 transition-transform hover:scale-110 focus:outline-none"
            >
              <Star 
                className={cn(
                  "w-12 h-12 transition-colors",
                  (hoveredRating || rating) >= star ? "fill-amber-400 text-amber-400" : "text-foreground/20"
                )} 
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold text-sm uppercase tracking-wider text-foreground/80">Your Experience</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tell us what you loved about the artwork..."
          rows={5}
          className="w-full rounded-xl border-border bg-background px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          required
          minLength={5}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
