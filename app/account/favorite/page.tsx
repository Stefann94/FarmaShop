import React from 'react';
import styles from '../Account.module.css';
import { createClient } from '@/lib/supabase/server';

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div>Neautorizat</div>;

  const { data: favorites } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', user.id);

  const hasFavorites = favorites && favorites.length > 0;

  return (
    <div>
      <h2 className={styles.heroTitle} style={{ marginBottom: '30px' }}>Produse <strong>favorite</strong></h2>
      
      {!hasFavorites ? (
        <div className={styles.premiumCard} style={{ textAlign: 'center', padding: '60px 20px', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#f0f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--color-primary)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </div>
          <div className={styles.cardHeader}>Niciun produs la favorite</div>
          <p className={styles.cardContent} style={{ maxWidth: '400px', margin: '0 auto 25px auto' }}>
            Salvează suplimentele tale preferate dând click pe inimioara de pe pagina fiecărui produs.
          </p>
          <a href="/" className={styles.actionLink}>
            Explorează magazinul
          </a>
        </div>
      ) : (
        <div className={styles.premiumCard}>
          <div className={styles.cardHeader}>Ai {favorites.length} produse favorite</div>
        </div>
      )}
    </div>
  );
}
