import Image from "next/image";
import HeroCarousel from "../components/HeroCarousel";
import styles from "./page.module.css";
import { createClient } from "../lib/supabase/server";
import ProductSection from "../components/ProductSection";

import ProductCarousel from "../components/ProductCarousel";

export const dynamic = 'force-dynamic';
export default async function Home() {
  const supabase = await createClient();
  const { data: slides } = await supabase.from('hero_slides').select('*').order('id');
  const { data: quickCategories } = await supabase.from('categories').select('*').eq('is_quick_category', true).order('sort_order').limit(6);
  
  // Fetch products for all sections
  const [
    { data: essentials },
    { data: focusEnergy },
    { data: premiumBundles },
    { data: recommendedProducts, error: recommendedError }
  ] = await Promise.all([
    supabase.from('products').select('*').eq('is_bestseller', true).limit(8),
    supabase.from('products').select('*').eq('is_focus_energy', true).limit(8),
    supabase.from('products').select('*').eq('is_premium_bundle', true).limit(8),
    supabase.from('products').select('*').eq('is_recommended', true).limit(10)
  ]);

  // Folosim fallback în caz că coloana 'is_recommended' încă nu a fost creată în baza de date
  const finalRecommended = recommendedError ? essentials : recommendedProducts;

  return (
    <>
      <main>
        <HeroCarousel slides={slides || []} />

        {/* QUICK CATEGORIES */}
        <section className={styles.quickCategoriesSection}>
          <div className="container">
            <div className={styles.quickCategoriesContainer}>
              {quickCategories?.map(cat => (
                <a key={cat.id} href={`/categorie/${cat.slug}`} className={styles.quickCategoryCard}>
                  <span className={styles.quickCategoryName}>{cat.name}</span>
                  <div className={styles.quickCategoryIcon}>
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCTS SECTIONS */}
        <ProductSection 
          title={<>Esențiale <span>pentru</span> Longevitate</>}
          products={essentials || []}
          viewAllLink="/produse?filter=essentials"
          badgeText="Bestseller"
        />

        {/* PROMO BANNER (Între Esențiale și Focus) */}
        <section className={styles.promoBannerSection}>
          <div className="container">
            <a href="/produse?filter=promo" className={styles.promoBannerLink}>
              {/* Folosim un tag standard <img> pentru a evita restricțiile stricte de domenii din Next.js Image */}
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop" 
                alt="Promo Banner" 
                className={styles.promoBannerImage}
              />
              <div className={styles.promoBannerOverlay}>
                <h3>Performanță Mentală Absolută</h3>
                <p>Descoperă noile extracte standardizate pentru focus și energie curată.</p>
                <span className={styles.promoBannerBtn}>Vezi Colecția</span>
              </div>
            </a>
          </div>
        </section>

        <ProductSection 
          title={<>Focus & <span>Claritate Mentală</span></>}
          products={focusEnergy || []}
          viewAllLink="/produse?filter=focus"
        />

        <ProductSection 
          title={<>Protocoale & <span>Pachete Premium</span></>}
          products={premiumBundles || []}
          viewAllLink="/produse?filter=bundles"
          badgeText="-15% Extra"
        />
        
        {/* RECOMMENDED CAROUSEL */}
        <ProductCarousel 
          title={<>Produse <span>Recomandate</span></>}
          products={finalRecommended || []}
        />
        
      </main>
    </>
  );
}
