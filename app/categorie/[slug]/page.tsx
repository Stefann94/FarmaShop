import { createClient } from "../../../lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import styles from "./Category.module.css";
import pageStyles from "../../page.module.css";
import AddToCartButton from "../../../components/AddToCartButton";
import FavoriteButton from "../../../components/FavoriteButton";

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient();
  const { slug } = await params;

  // 1. Fetch category
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!category) {
    notFound();
  }

  // 2. Fetch products for this category
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category_slug', slug)
    .order('created_at', { ascending: false });

  // Premium Hero Images mapped by category for visual excellence
  const heroImages: Record<string, string> = {
    'longevitate': 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=2000&auto=format&fit=crop',
    'focus': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop',
    'somn': 'https://images.unsplash.com/photo-1517457223594-5582f6e91122?q=80&w=2000&auto=format&fit=crop',
    'pachete': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2000&auto=format&fit=crop',
    'esentiale': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2000&auto=format&fit=crop',
    'imunitate': 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=2000&auto=format&fit=crop'
  };

  const heroDescriptions: Record<string, string> = {
    'longevitate': 'Descoperă formule științifice premium pentru regenerarea celulară și o viață lungă, vibrantă.',
    'focus': 'Performanță mentală absolută. Extracte standardizate pentru concentrare și energie curată, fără crash.',
    'somn': 'Secretul recuperării tale. Suplimente dedicate pentru un somn adânc, odihnitor și reducerea stresului.',
    'pachete': 'Protocoale complete create de experți pentru rezultate maxime și sinergie perfectă.',
    'esentiale': 'Nutrienții de bază de care corpul tău are nevoie zilnic pentru o funcționare optimă.',
    'imunitate': 'Susține-ți bariera naturală de protecție cu antioxidanți puternici și extracte pure.'
  };

  const defaultHero = 'https://images.unsplash.com/photo-1502741224143-90385d7b8a8e?q=80&w=2000&auto=format&fit=crop';
  const heroImg = category.image_url || heroImages[slug] || defaultHero;
  const heroDesc = heroDescriptions[slug] || 'Explorează colecția noastră de suplimente premium pentru un stil de viață sănătos.';

  // Helper to split title beautifully
  const renderTitle = (title: string) => {
    if (title.includes(' & ')) {
      const parts = title.split(' & ');
      return (
        <>
          {parts[0]} <span style={{color: 'white', fontWeight: 300}}>&</span> <span>{parts[1]}</span>
        </>
      );
    }
    return <span>{title}</span>;
  };

  return (
    <main>
      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <Image 
          src={heroImg} 
          alt={category.name} 
          fill 
          className={styles.heroImage}
          priority
        />
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {renderTitle(category.name)}
          </h1>
          <p className={styles.heroSubtitle}>{heroDesc}</p>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className={styles.gridSection}>
        <div className="container">
          {(!products || products.length === 0) ? (
            <div className={styles.emptyState}>
              În acest moment nu există produse disponibile în această categorie. Te rugăm să revii!
            </div>
          ) : (
            <div className={pageStyles.productsGrid}>
              {products.map((product) => (
                <div key={product.id} className={pageStyles.productCard}>
                  <div className={pageStyles.productImageWrapper}>
                    {product.is_bestseller && <div className={pageStyles.productBadge}>Bestseller</div>}
                    <FavoriteButton className={pageStyles.favoriteBtn} productSlug={product.slug} />
                    <a href={`/produs/${product.slug}`} style={{ display: 'block' }}>
                      <Image 
                        src={product.image_url || '/placeholder.png'} 
                        alt={product.name} 
                        fill 
                        className={pageStyles.productImage}
                      />
                    </a>
                  </div>
                  <div className={pageStyles.productInfo}>
                    <h3 className={pageStyles.productName}>
                      <a href={`/produs/${product.slug}`}>{product.name}</a>
                    </h3>
                    <div className={pageStyles.productFooter}>
                      <div className={pageStyles.productPrice}>{product.price} <span className={pageStyles.currency}>RON</span></div>
                      <AddToCartButton 
                        productSlug={product.slug}
                        price={product.price}
                        variant="icon"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* TRUST SECTION */}
      <section className={styles.trustSection}>
        <div className="container">
          <h2 className={styles.trustTitle}>Calitate Fără Compromisuri</h2>
          <p className={styles.trustText}>
            La LongevityFarma, fiecare produs din categoria <strong>{category.name}</strong> trece prin cele mai riguroase teste de puritate. 
            Folosim doar extracte standardizate, biodisponibile, pentru a ne asigura că organismul tău asimilează exact ceea ce are nevoie, la capacitate maximă.
          </p>
        </div>
      </section>
    </main>
  );
}
