import React from 'react';
import styles from '../Account.module.css';
import { createClient } from '@/lib/supabase/server';

export default async function ReviewsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div>Neautorizat</div>;

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', user.id);

  const hasReviews = reviews && reviews.length > 0;

  return (
    <div>
      <h2 className={styles.heroTitle} style={{ marginBottom: '30px' }}>Recenziile <strong>mele</strong></h2>
      
      {!hasReviews ? (
        <div className={styles.premiumCard} style={{ textAlign: 'center', padding: '60px 20px', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#f4f8f1', border: '1px solid #d6e4d9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--color-primary)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
          <div className={styles.cardHeader}>Nu ai lăsat încă nicio recenzie</div>
          <p className={styles.cardContent} style={{ maxWidth: '400px', margin: '0 auto' }}>
            Părerea ta contează! Ajută comunitatea LongevityFarma lăsând un review produselor achiziționate.
          </p>
        </div>
      ) : (
        <div className={styles.premiumCard}>
          <div className={styles.cardHeader}>Ai {reviews.length} recenzii</div>
        </div>
      )}
    </div>
  );
}
