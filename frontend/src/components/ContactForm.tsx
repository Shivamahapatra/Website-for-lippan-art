"use client";

import { useState } from "react";
import { submitContactForm } from "@/actions/contact";
import { Loader2, CheckCircle2, Send, MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

export function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await submitContactForm(formData);

    if (res.success) {
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } else {
      setError(res.error || "Something went wrong.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-12 bg-card rounded-3xl border border-foreground/5 shadow-xl text-center h-full"
      >
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
        <h3 className="text-3xl font-bold mb-4">Message Sent!</h3>
        <p className="text-foreground/70 text-lg">
          Thank you for reaching out. We will get back to you at {formData.email} as soon as possible.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-8 px-6 py-3 bg-muted hover:bg-foreground/10 rounded-xl font-semibold transition-colors"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
      
      {/* Contact Info Side */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col justify-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 text-foreground">
          Let's Get in Touch
        </h2>
        <p className="text-lg text-foreground/70 mb-12 max-w-md leading-relaxed">
          Whether you have a question about a specific artwork, need support with an order, or want to discuss a custom commission, we'd love to hear from you.
        </p>

        <div className="flex flex-col gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Email Us</h4>
              <p className="text-foreground/60 text-lg">support@lippanart.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Call Us</h4>
              <p className="text-foreground/60 text-lg">+91 98765 43210</p>
              <p className="text-sm text-foreground/40 mt-1">Mon-Fri from 9am to 6pm</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Visit the Studio</h4>
              <p className="text-foreground/60 text-lg">F401 Innovative Aqua Front, 403</p>
              <p className="text-foreground/60 text-lg">Vibhutipura Extension, Doddanekkundi</p>
              <p className="text-foreground/60 text-lg">Bengaluru, Karnataka 560037</p>
              <a 
                href="https://maps.app.goo.gl/4Nufp26ZGrZjBsYA7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm font-bold text-primary hover:text-accent transition-colors"
              >
                Open in Google Maps &rarr;
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form Side */}
      <motion.form 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onSubmit={handleSubmit} 
        className="flex flex-col gap-6 bg-card p-8 md:p-10 rounded-3xl border border-foreground/5 shadow-xl"
      >
        <h3 className="text-2xl font-bold mb-2">Send a Message</h3>
        
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
            className="px-4 py-4 rounded-xl border border-foreground/10 bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
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
            className="px-4 py-4 rounded-xl border border-foreground/10 bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder="jane@example.com"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Phone Number (Optional)</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="px-4 py-4 rounded-xl border border-foreground/10 bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder="+91 98765 43210"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Your Message</label>
          <textarea
            required
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="px-4 py-4 rounded-xl border border-foreground/10 bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
            placeholder="How can we help you?"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 mt-2 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-accent transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
              Send Message <Send className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      </motion.form>
    </div>
  );
}
