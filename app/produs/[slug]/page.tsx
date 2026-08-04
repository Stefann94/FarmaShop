import { notFound } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '../../../lib/supabase/server';
import styles from './ProductPage.module.css';
import ProductCarousel from '../../../components/ProductCarousel';
import ProductImageZoom from '../../../components/ProductImageZoom';

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
            {product.tags && product.tags.length > 0 && (
              <div className={styles.tagsContainer}>
                {product.tags.map((tag: string, idx: number) => (
                  <span key={idx} className={`${styles.tag} ${tag.includes('%') || tag.toLowerCase().includes('reducere') ? styles.tagDiscount : ''}`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <ProductImageZoom 
              src={product.image_url || '/placeholder.png'} 
              alt={product.name} 
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

            {/* INFO & LOGISTICS */}
            <div className={styles.infoNotice}>
              <svg className={styles.infoIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>Ofertă exclusivă online. Prețurile din farmaciile fizice pot fi diferite.</span>
            </div>

            <div className={styles.logisticsBlock}>
              <div className={styles.logisticRow}>
                <svg className={styles.logisticIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                <span>{product.in_stock !== false ? 'Disponibil în stoc cu livrare rapidă' : 'Stoc epuizat temporar'}</span>
              </div>
              <div className={styles.logisticRow}>
                <svg className={styles.logisticIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                <span>Fără costuri de transport la ridicarea din farmacie</span>
              </div>
            </div>

          </div>
        </section>

        {/* FULL WIDTH DESCRIPTION */}
        <section className={styles.fullDescriptionSection}>
          <div className={styles.descriptionBlock}>
            <h3 className={styles.descriptionTitle}>Informații Produs</h3>
            <p className={styles.descriptionText}>
              {product.description || "Informațiile detaliate despre acest produs urmează a fi actualizate în curând. Formulele FarmaShop sunt dezvoltate pentru eficiență și puritate maximă."}
            </p>
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
