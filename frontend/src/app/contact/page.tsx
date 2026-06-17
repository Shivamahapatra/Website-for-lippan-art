import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden bg-background">
      {/* Aurora Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[128px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[128px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <ContactForm />
      </div>
    </main>
  );
}
