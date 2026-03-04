import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NotificationProvider } from "@/context/NotificationContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Daisy Brew",
    template: "%s | Daisy Brew",
  },
  description: "Daisy Brew Coffee Ordering System",
  icons: {
  icon: "/favicon.ico",
}
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
<html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <CartProvider>
            <NotificationProvider>
                {children}
              <Toaster position="top-right" />
            </NotificationProvider>
           </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
