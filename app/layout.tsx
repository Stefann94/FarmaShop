import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import ScrollToTop from "@/components/ScrollToTop";
import { createClient } from '@/lib/supabase/server';

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Longevity Farma | Suplimente Premium",
  description: "Investește Astăzi în Ziua de Mâine. Suplimente alimentare premium pentru vitalitate și funcția cognitivă.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userKey = user?.id || 'guest';

  return (
    <html lang="ro">
      <body className={`${outfit.variable}`}>
        <ScrollToTop />
        <FavoritesProvider key={userKey}>
          <CartProvider key={userKey}>
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
