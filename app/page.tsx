import Image from "next/image";
import HeroCarousel from "../components/HeroCarousel";
import styles from "./page.module.css";
import { createClient } from "../lib/supabase/server";

export const dynamic = 'force-dynamic';
export default async function Home() {
  const supabase = await createClient();
  const { data: slides } = await supabase.from('hero_slides').select('*').order('id');
  const { data: quickCategories } = await supabase.from('categories').select('*').eq('is_quick_category', true).order('sort_order').limit(6);
  const { data: products } = await supabase.from('products').select('*').eq('is_bestseller', true).limit(4);

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

        {/* PRODUCTS SECTION */}
        <section id="produse" className={styles.productsSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Esențiale <span>pentru</span> Longevitate
              </h2>
              <a href="/produse" className={styles.viewAllLink}>
                Vezi toate <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </a>
            </div>

            <div className={styles.productsGrid}>
              {products?.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.productImageWrapper}>
                    <div className={styles.productBadge}>Bestseller</div>
                    <button className={styles.favoriteBtn} aria-label="Adauga la favorite">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
                    <Image 
                      src={product.image_url || '/placeholder.png'} 
                      alt={product.name}
                      fill
                      className={styles.productImage}
                    />
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>
                      <a href={`/produs/${product.slug}`}>{product.name}</a>
                    </h3>
                    <div className={styles.productFooter}>
                      <div className={styles.productPrice}>{product.price} <span className={styles.currency}>RON</span></div>
                      <button className={styles.addToCartBtn} aria-label="Adaugă în coș">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
