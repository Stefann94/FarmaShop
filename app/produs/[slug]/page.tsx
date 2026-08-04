import { notFound } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '../../../lib/supabase/server';
import styles from './ProductPage.module.css';
import ProductCarousel from '../../../components/ProductCarousel';

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase.from('products').select('*').eq('slug', slug).single();

  if (!product) {
    return { title: 'Produs Neregasit | FarmaShop' };
  }

  return {
    title: `${product.name} | FarmaShop`,
    description: product.description || `Comandă ${product.name} la doar ${product.price} RON. Livrare rapidă.`,
    openGraph: {
      title: `${product.name} | FarmaShop`,
      description: product.description,
      images: [product.image_url],
    }
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase.from('products').select('*').eq('slug', slug).single();

  if (!product) {
    notFound();
  }

  // Fetch similar products for the carousel based on category_slug
  let similarProductsQuery = supabase.from('products').select('*').neq('slug', product.slug);
  
  if (product.category_slug) {
    similarProductsQuery = similarProductsQuery.eq('category_slug', product.category_slug);
  }
  
  // Fetch more items than needed to shuffle them in JavaScript
  const { data: rawSimilarProducts } = await similarProductsQuery.limit(20);
  
  // Amestecăm (shuffle) produsele pentru a fi random la fiecare încărcare
  const shuffledProducts = rawSimilarProducts ? [...rawSimilarProducts].sort(() => 0.5 - Math.random()) : [];
  const similarProducts = shuffledProducts.slice(0, 8);

  // Generate Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image_url,
    "description": product.description || `Descoperă beneficiile ${product.name}.`,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "RON",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviews_count || 1
    } : undefined
  };

  const tags = product.tags || [];

  return (
    <main className={styles.productPage}>
      {/* Inject JSON-LD Script for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container">
        {/* BREADCRUMB */}
        <div className={styles.breadcrumb}>
          <a href="/">Acasă</a> / <a href="/produse">Produse</a> / <span>{product.name}</span>
        </div>

        {/* MAIN SECTION (2 COLUMNS) */}
        <section className={styles.mainSection}>
          {/* LEFT: IMAGE */}
          <div className={styles.imageColumn}>
            {tags && tags.length > 0 && (
              <div className={styles.tagsContainer}>
                {tags.map((tag: string, idx: number) => (
                  <span key={idx} className={`${styles.tag} ${tag.includes('%') || tag.toLowerCase().includes('reducere') ? styles.tagDiscount : ''}`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <Image 
              src={product.image_url || '/placeholder.png'} 
              alt={product.name} 
              fill
              className={styles.productImage}
            />
          </div>

          {/* RIGHT: DETAILS */}
          <div className={styles.detailsColumn}>
            <h1 className={styles.productTitle}>{product.name}</h1>
            
            <div className={styles.ratingContainer}>
              <div className={styles.stars}>
                {/* 5 Stars */}
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i < Math.round(product.rating || 5) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                ))}
              </div>
              <span className={styles.reviewsCount}>
                {product.rating || "5.0"} ({product.reviews_count || "0"} review-uri)
              </span>
            </div>

            <div className={styles.priceBlock}>
              <span className={styles.price}>{product.price}</span>
              <span className={styles.currency}> Lei</span>
            </div>

            {/* INSTALLMENT BOX */}
            <div className={styles.installmentBox}>
              <div className={styles.installmentText}>
                <span className={styles.installmentTitle}>Plătește în 4 rate egale</span>
                <span className={styles.installmentSub}>de la {(product.price / 4).toFixed(2)} Lei / lună</span>
              </div>
              <span className={styles.installmentBadge}>0% Dobândă</span>
            </div>

            {/* BUTTONS */}
            <div className={styles.actionsBlock}>
              <button className={styles.btnAddToCart}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Adaugă în Coș
              </button>
              <button className={styles.btnFav}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            {/* DESCRIPTION */}
            <div className={styles.descriptionBlock}>
              <h3 className={styles.descriptionTitle}>Informații Produs</h3>
              <p className={styles.descriptionText}>
                {product.description || "Informațiile detaliate despre acest produs urmează a fi actualizate în curând. Formulele FarmaShop sunt dezvoltate pentru eficiență și puritate maximă."}
              </p>
            </div>
          </div>
        </section>

        {/* SIMILAR PRODUCTS */}
        <ProductCarousel 
          title={<>Produse <span>Similare</span></>}
          products={similarProducts || []}
        />
      </div>
    </main>
  );
}
