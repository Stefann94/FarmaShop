import React from 'react';
import styles from '../Account.module.css';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const metadata = {
  title: 'Produse Favorite | FarmaShop',
};

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div>Neautorizat</div>;

  // Fetch favorite products
  const { data: favorites } = await supabase
    .from('favorites')
    .select('product_slug, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  let favoriteProducts: any[] = [];

  if (favorites && favorites.length > 0) {
    const slugs = favorites.map(f => f.product_slug);
    const { data: products } = await supabase
      .from('products')
      .select('slug, name, image_url, price')
      .in('slug', slugs);
      
    if (products) {
      // Create a map to preserve order from favorites
      const productMap = new Map(products.map(p => [p.slug, p]));
      favoriteProducts = favorites.map(f => ({
        ...f,
        ...productMap.get(f.product_slug)
      })).filter(p => p.name); // Filter out any products that might have been deleted
    }
  }

  const hasFavorites = favoriteProducts.length > 0;

  return (
    <div>
      <h2 className={styles.heroTitle} style={{ marginBottom: '30px' }}>Produse <strong>favorite</strong></h2>
      
      {!hasFavorites ? (
        <div className={styles.premiumCard} style={{ textAlign: 'center', padding: '60px 20px', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#f0f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: 'var(--color-primary)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </div>
          <div className={styles.cardHeader}>Nu ai adăugat niciun produs la favorite.</div>
          <p className={styles.cardContent} style={{ maxWidth: '400px', margin: '0 auto 25px auto' }}>
            Aici vei găsi produsele pe care le-ai marcat cu inimă pentru a le recumpăra ușor mai târziu.
          </p>
          <Link href="/" className={styles.actionLink}>
            Începe cumpărăturile
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {favoriteProducts.map((product) => (
            <div key={product.product_slug} className={styles.premiumCard} style={{ display: 'flex', flexDirection: 'column', padding: '20px', border: '2px solid var(--color-primary)' }}>
              <Link href={`/produs/${product.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ position: 'relative', height: '150px', marginBottom: '15px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={product.image_url || '/placeholder.png'} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#333', marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
              </Link>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{product.price} Lei</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
