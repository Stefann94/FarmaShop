import React from 'react';
import styles from '../Account.module.css';
import { createClient } from '@/lib/supabase/server';

export default async function PaymentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div>Neautorizat</div>;

  const { data: methods } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', user.id);

  const hasMethods = methods && methods.length > 0;

  return (
    <div>
      <h2 className={styles.heroTitle} style={{ marginBottom: '30px' }}>Metode de plată <strong>memorate</strong></h2>
      
      {!hasMethods ? (
        <div className={styles.premiumCard} style={{ textAlign: 'center', padding: '60px 20px', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#f4f8f1', border: '1px solid #d6e4d9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--color-primary)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
          </div>
          <div className={styles.cardHeader}>Niciun card salvat</div>
          <p className={styles.cardContent} style={{ maxWidth: '400px', margin: '0 auto 25px auto' }}>
            Plata la checkout se face rapid și sigur. Poți memora cardul tău la prima comandă pentru viitoare achiziții.
          </p>
        </div>
      ) : (
        <div className={styles.premiumCard}>
          <div className={styles.cardHeader}>Ai {methods.length} metode de plată salvate</div>
        </div>
      )}
    </div>
  );
}
