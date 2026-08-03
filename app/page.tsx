import Image from "next/image";
import HeroCarousel from "../components/HeroCarousel";
import styles from "./page.module.css";
import { createClient } from "../lib/supabase/server";

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: "NMN Puritate 99%",
    price: "189 RON",
    image: "/product-1-tr.png"
  },
  {
    id: 2,
    name: "Resveratrol Complex",
    price: "145 RON",
    image: "/product-2-tr.png"
  },
  {
    id: 3,
    name: "Omega-3 Vegan",
    price: "99 RON",
    image: "/product-3-tr.png"
  },
  {
    id: 4,
    name: "Magneziu Bisglicinat",
    price: "85 RON",
    image: "/product-4-tr.png"
  }
];

export default async function Home() {
  const supabase = await createClient();
  const { data: slides } = await supabase.from('hero_slides').select('*').order('id');
  const { data: quickCategories } = await supabase.from('categories').select('*').order('sort_order').limit(6);

  return (
    <>
      <main>
        <HeroCarousel slides={slides || []} />

        {/* QUICK CATEGORIES */}
        <section className={styles.quickCategoriesSection}>
          <div className={`container ${styles.quickCategoriesContainer}`}>
            {quickCategories?.map(cat => (
              <a key={cat.id} href={`/categorie/${cat.slug}`} className={styles.quickCategoryCard}>
                <span className={styles.quickCategoryName}>{cat.name}</span>
                <div className={styles.quickCategoryIcon}>
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* PRODUCTS SECTION */}
        <section id="produse" className={styles.productsSection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>
              Esențiale <span>pentru</span> Longevitate
            </h2>
            <p className={styles.sectionDesc}>
              Cele mai apreciate formule ale noastre, concepute pentru a adresa cauzele fundamentale ale îmbătrânirii celulare.
            </p>

            <div className={styles.productsGrid}>
              {mockProducts.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.productImage}>
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <div className={styles.productPrice}>{product.price}</div>
                  <button className="btn btn-primary productBtn">Adaugă în coș</button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
