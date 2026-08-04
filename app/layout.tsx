import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Longevity Farma | Suplimente Premium",
  description: "Investește Astăzi în Ziua de Mâine. Suplimente alimentare premium pentru vitalitate și funcția cognitivă.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={`${outfit.variable}`}>
        <FavoritesProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
