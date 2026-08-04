import Image from "next/image";
import HeroCarousel from "../components/HeroCarousel";
import styles from "./page.module.css";
import { createClient } from "../lib/supabase/server";
import ProductSection from "../components/ProductSection";

export const dynamic = 'force-dynamic';
export default async function Home() {
  const supabase = await createClient();
  const { data: slides } = await supabase.from('hero_slides').select('*').order('id');
  const { data: quickCategories } = await supabase.from('categories').select('*').eq('is_quick_category', true).order('sort_order').limit(6);
  
  // Fetch products for all 3 sections
  const [
    { data: essentials },
    { data: focusEnergy },
    { data: premiumBundles }
  ] = await Promise.all([
    supabase.from('products').select('*').eq('is_bestseller', true).limit(8),
    supabase.from('products').select('*').eq('is_focus_energy', true).limit(8),
    supabase.from('products').select('*').eq('is_premium_bundle', true).limit(8)
  ]);

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
        
      </main>
    </>
  );
}
