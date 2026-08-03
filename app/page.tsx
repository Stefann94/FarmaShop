import Image from "next/image";
import styles from "./page.module.css";

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: "NMN Puritate 99%",
    price: "189 RON",
    image: "/mock-product-1.jpg" // Placeholders, we'll just show a gray box for now
  },
  {
    id: 2,
    name: "Resveratrol Complex",
    price: "145 RON",
    image: "/mock-product-2.jpg"
  },
  {
    id: 3,
    name: "Omega-3 Vegan",
    price: "99 RON",
    image: "/mock-product-3.jpg"
  },
  {
    id: 4,
    name: "Magneziu Bisglicinat",
    price: "85 RON",
    image: "/mock-product-4.jpg"
  }
];

export default function Home() {
  return (
    <>
      {/* TOP BAR */}
      <div className={styles.topBar}>
        <div className={styles.tickerContent}>
          {/* Group 1 */}
          <div className={styles.tickerGroup}>
            <span className={styles.tickerItem}>Livrare gratuită la comenzi peste <strong>200 RON</strong></span>
            <span className={styles.tickerItem}>•</span>
            <span className={styles.tickerItem}>Folosește codul <strong>LONGEVITY15</strong> pentru 15% reducere</span>
            <span className={styles.tickerItem}>•</span>
            <span className={styles.tickerItem}>🌿 <strong>Pachete Imunitate</strong> cu -20% reducere doar săptămâna aceasta</span>
            <span className={styles.tickerItem}>•</span>
            <span className={styles.tickerItem}>Abonează-te la newsletter și primești <strong>10% OFF</strong></span>
            <span className={styles.tickerItem}>•</span>
          </div>
          {/* Group 2 (Duplicate for infinite scroll loop) */}
          <div className={styles.tickerGroup}>
            <span className={styles.tickerItem}>Livrare gratuită la comenzi peste <strong>200 RON</strong></span>
            <span className={styles.tickerItem}>•</span>
            <span className={styles.tickerItem}>Folosește codul <strong>LONGEVITY15</strong> pentru 15% reducere</span>
            <span className={styles.tickerItem}>•</span>
            <span className={styles.tickerItem}>🌿 <strong>Pachete Imunitate</strong> cu -20% reducere doar săptămâna aceasta</span>
            <span className={styles.tickerItem}>•</span>
            <span className={styles.tickerItem}>Abonează-te la newsletter și primești <strong>10% OFF</strong></span>
            <span className={styles.tickerItem}>•</span>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className={styles.header}>
        <div className={`container ${styles.navContainer}`}>
          {/* Top Row: Actions and Centered Logo */}
          <div className={styles.topRow}>
            {/* Left side */}
            <div className={styles.leftActions}>
              <button className={styles.iconBtn} aria-label="Meniu Categorii">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
              <button className={styles.iconBtn} aria-label="Căutare">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
            </div>

            {/* Center Logo */}
            <div className={styles.logoCenter}>
              <a href="#" className={styles.logo}>
                <svg className={styles.logoIcon} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 1 8.3C19.24 16.46 13.84 20 11 20Z"/>
                  <path d="M11 20c2-5 0-11-2-11"/>
                </svg>
                <div className={styles.logoTextWrapper}>
                  <div className={styles.logoText}>
                    Longevity<span className={styles.logoTextLight}>Farma</span>
                  </div>
                  <span className={styles.premiumText}>Premium Quality</span>
                </div>
              </a>
            </div>

            {/* Right side */}
            <div className={styles.rightActions}>
              <button className={styles.iconBtn} aria-label="Favorite">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
              <button className={styles.iconBtn} aria-label="Cont utilizator">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </button>
              <button className={styles.cartBtn} aria-label="Coș cumpărături">
                <div className={styles.cartIconWrapper}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                  <span className={styles.cartBadge}>2</span>
                </div>
                <span className={styles.cartTotal}>334 Lei</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Minimalist Navigation */}
          <nav className={styles.bottomMenu}>
            <a href="#bestsellers" className={styles.menuLink}>Bestsellers</a>
            <a href="#pachete" className={styles.menuLink}>Pachete & Oferte</a>
            <a href="#calitate" className={styles.menuLink}>Calitate & Ingrediente</a>
            <a href="#abonamente" className={styles.menuLink}>Abonamente</a>
            <a href="#jurnal" className={styles.menuLink}>Jurnal Științific</a>
            <a href="#despre-noi" className={styles.menuLink}>Despre Noi</a>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className={styles.hero}>
          <div className={`container ${styles.heroContainer}`}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Investește Astăzi în <span className={styles.titleHighlight}>Ziua de Mâine.</span>
              </h1>
              <p className={styles.heroDesc}>
                Suplimente alimentare premium, formulate științific pentru a susține vitalitatea, funcția cognitivă și o îmbătrânire sănătoasă.
              </p>
              
              <div className={styles.heroActions}>
                <a href="#produse" className={`btn btn-primary`}>Descoperă Produsele</a>
                <a href="#afla-mai-multe" className={`btn btn-outline`}>Află mai multe</a>
              </div>

              <div className={styles.heroFeatures}>
                <div className={styles.featureItem}>
                  <svg className={styles.featureIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Formule curate
                </div>
                <div className={styles.featureItem}>
                  <svg className={styles.featureIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Fără alergeni
                </div>
                <div className={styles.featureItem}>
                  <svg className={styles.featureIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Validat științific
                </div>
              </div>
            </div>

            <div className={styles.heroImageWrapper}>
              {/* This is a placeholder for the beautiful image */}
              <div style={{color: 'rgba(255,255,255,0.7)', fontStyle: 'italic'}}>Imagine Premium Suplimente</div>
              
              <div className={styles.qualityBadge}>
                <svg className={styles.badgeIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                <div className={styles.badgeText}>
                  <span className={styles.badgeTitle}>CALITATE</span>
                  <span className={styles.badgeSubtitle}>Premium Garantat</span>
                </div>
              </div>
            </div>
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
                    Imagine Produs
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
