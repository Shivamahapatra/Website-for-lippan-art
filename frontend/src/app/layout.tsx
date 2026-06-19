import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lippan Art",
  description: "Beautiful modern Lippan Art",
};

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          card: "bg-background/80 backdrop-blur-xl border border-foreground/10 shadow-2xl rounded-3xl p-6 sm:p-8",
          headerTitle: "text-foreground font-bold tracking-tighter text-3xl",
          headerSubtitle: "text-foreground/60",
          socialButtonsBlockButton: 
            "bg-muted/50 border border-foreground/10 hover:bg-muted text-foreground transition-all rounded-xl py-3 shadow-sm",
          socialButtonsBlockButtonText: "text-foreground font-semibold",
          dividerLine: "bg-foreground/10",
          dividerText: "text-foreground/40",
          formFieldLabel: "text-foreground font-medium mb-1.5",
          formFieldInput: 
            "bg-muted/50 border border-foreground/10 text-foreground rounded-xl focus:ring-2 focus:ring-primary/50 transition-all py-2.5 shadow-sm",
          formButtonPrimary: 
            "bg-gradient-to-br from-primary to-accent hover:opacity-90 transition-opacity text-primary-foreground font-semibold rounded-xl py-3 shadow-md",
          footerActionText: "text-foreground/60",
          footerActionLink: "text-primary hover:text-accent font-semibold transition-colors",
          identityPreviewText: "text-foreground font-medium",
          identityPreviewEditButtonIcon: "text-primary hover:text-accent",
          formFieldWarningText: "text-orange-500",
          formFieldErrorText: "text-red-500",
          alertText: "text-foreground",
          alert: "bg-red-500/10 border border-red-500/20",
          navbar: "hidden", // Hide clerk internal navbar for a cleaner look
        },
        variables: {
          borderRadius: "0.75rem",
        }
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <CartDrawer />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
