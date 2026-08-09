import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import ScrollToTop from "@/components/ScrollToTop";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import BackToTopButton from "@/components/BackToTopButton";
import { createClient } from '@/lib/supabase/server';
import { getSiteUrl } from '@/lib/site';

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Baza pentru toate URL-urile relative din metadate (og:image, og:url etc.).
  // Fără ea, imaginile Open Graph rămân căi relative pe care Facebook/WhatsApp
  // nu le pot rezolva, iar previzualizarea la distribuire apare goală.
  metadataBase: new URL(getSiteUrl()),
  title: "Longevity Farma | Suplimente Premium pentru Sănătate",
  description: "Investește Astăzi în Ziua de Mâine. Suplimente alimentare premium, formulate științific pentru vitalitate, energie și funcția cognitivă.",
  keywords: ["suplimente", "longevitate", "anti-aging", "nootropice", "sanatate", "vitamine premium"],
  openGraph: {
    title: "Longevity Farma | Suplimente Premium",
    description: "Investește Astăzi în Ziua de Mâine cu cele mai bune suplimente pentru corpul tău.",
    url: "/",
    siteName: "Longevity Farma",
    locale: "ro_RO",
    type: "website",
  },
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
        <GoogleAnalytics />
        <ScrollToTop />
        <FavoritesProvider key={userKey}>
          <CartProvider key={userKey}>
            <Header />
            {children}
            <Footer />
            <BackToTopButton />
          </CartProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
