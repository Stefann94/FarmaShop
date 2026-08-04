import Image from "next/image";
import styles from "../app/page.module.css";

interface Product {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  price: number;
}

interface ProductSectionProps {
  title: React.ReactNode;
  products: Product[];
  viewAllLink?: string;
  badgeText?: string;
}

export default function ProductSection({ title, products, viewAllLink, badgeText }: ProductSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className={styles.productsSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          {viewAllLink && (
            <a href={viewAllLink} className={styles.viewAllLink}>
              Vezi toate <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </a>
          )}
        </div>

        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productImageWrapper}>
                {badgeText && <div className={styles.productBadge}>{badgeText}</div>}
                <button className={styles.favoriteBtn} aria-label="Adauga la favorite">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
                <a href={`/produs/${product.slug}`} style={{ display: 'block' }}>
                  <Image 
                    src={product.image_url || '/placeholder.png'} 
                    alt={product.name}
                    fill
                    className={styles.productImage}
                  />
                </a>
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>
                  <a href={`/produs/${product.slug}`}>{product.name}</a>
                </h3>
                <div className={styles.productFooter}>
                  <div className={styles.productPrice}>{product.price} <span className={styles.currency}>RON</span></div>
                  <button className={styles.addToCartBtn} aria-label="Adaugă în coș">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
