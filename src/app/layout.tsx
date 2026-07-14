import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import ReturnToTopButton from "@/components/ReturnToTopButton";
import ScrollToTop from "@/components/ScrollToTop";

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "XTRACITY HOSTELS AND APARTMENTS LTD - Luxury Student Residence",
  description: "Experience premium student living in Ghana. High-speed Wi-Fi, 24/7 security, backup power, and a clean, safe environment.",
  manifest: "/manifest.json",
  themeColor: "#E03B0D",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Xtracity",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`h-full antialiased ${plusJakarta.variable}`} suppressHydrationWarning>
        <head>
          <Script id="theme-script" strategy="beforeInteractive">
            {`try{if(localStorage.theme==='dark'||(!('theme'in localStorage)&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(_){};`}
          </Script>
        </head>
        <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
          <ScrollToTop />
          {children}
          <ReturnToTopButton />
          <WhatsAppButton />
        </body>
      </html>
    </ClerkProvider>
  );
}
