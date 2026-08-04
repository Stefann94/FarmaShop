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

        {/* TRUST BADGES SECTION */}
        <section className={styles.trustBadgesSection}>
          <div className="container">
            <div className={styles.trustGrid}>
              <div className={styles.trustItem}>
                <svg className={styles.trustIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                </svg>
                <h4 className={styles.trustTitle}>100% Naturale</h4>
                <p className={styles.trustDesc}>Ingrediente pure, extrase din plante medicinale, fără excipienți sintetici.</p>
              </div>
              
              <div className={styles.trustItem}>
                <svg className={styles.trustIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <h4 className={styles.trustTitle}>Fără Aditivi</h4>
                <p className={styles.trustDesc}>Formule curate, încapsulate fără aditivi de umplutură sau conservanți.</p>
              </div>

              <div className={styles.trustItem}>
                <svg className={styles.trustIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <h4 className={styles.trustTitle}>Standard Premium</h4>
                <p className={styles.trustDesc}>Dezvoltate pe baza ultimelor studii din domeniul longevității și anti-aging.</p>
              </div>

              <div className={styles.trustItem}>
                <svg className={styles.trustIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 2v2"></path><path d="M15 2v2"></path><path d="M12 2v2"></path><path d="M5.13 14.12 3 22h18l-2.13-7.88a1.98 1.98 0 0 0-1.87-1.46H7c-.89 0-1.68.6-1.87 1.46Z"></path><path d="M21 22v-2"></path><path d="M3 22v-2"></path><path d="M10 10V6a2 2 0 1 1 4 0v4"></path>
                </svg>
                <h4 className={styles.trustTitle}>Testat în Laborator</h4>
                <p className={styles.trustDesc}>Calitate certificată și riguros testată de laboratoare terțe independente.</p>
              </div>
            </div>
          </div>
        </section>

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
