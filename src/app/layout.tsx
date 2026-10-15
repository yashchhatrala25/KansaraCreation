import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import CartDrawer from "@/components/ui/CartDrawer";
import PageTracker from "@/components/analytics/PageTracker";

export const metadata: Metadata = {
  title: "Kansara Creation | Luxury Handcrafted Embroidery & Bohemian Decor",
  description:
    "Discover bespoke handmade anniversary calendar embroidery hoops, couple name wall hangings, botanical embroidered hair bows, and bohemian macrame dreamcatchers. Crafted with love in Gujarat, India.",
  keywords: [
    "Kansara Creation",
    "embroidery hoop wall hanging",
    "calendar embroidery hoop",
    "couple name embroidery",
    "handmade hair bows",
    "embroidered velvet bows",
    "dreamcatcher wall hanging",
    "boho macrame",
    "Ahmedabad crafts",
    "custom handmade gifts",
  ],
  authors: [{ name: "Kansara Creation" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/favicon.svg", type: "image/svg+xml" },
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Kansara Creation | Luxury Handcrafted Embroidery & Decor",
    description:
      "Handcrafted embroidery hoop wall hangings, embroidered hair bows, and dreamcatchers with tassels.",
    url: "https://kansaracreation.com",
    siteName: "Kansara Creation",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-content-primary antialiased min-h-screen flex flex-col selection:bg-pink-500 selection:text-white">
        <CartProvider>
          <PageTracker />
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
