import React from 'react';
import styles from '../Account.module.css';
import { createClient } from '@/lib/supabase/server';

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div>Neautorizat</div>;

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id);

  const hasOrders = orders && orders.length > 0;

  return (
    <div>
      <h2 className={styles.heroTitle} style={{ marginBottom: '30px' }}>Comenzile <strong>mele</strong></h2>
      
      {!hasOrders ? (
        <div className={styles.premiumCard} style={{ textAlign: 'center', padding: '60px 20px', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#f0f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--color-primary)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </div>
          <div className={styles.cardHeader}>Nu ai nicio comandă plasată încă</div>
          <p className={styles.cardContent} style={{ maxWidth: '400px', margin: '0 auto 25px auto' }}>
            Când vei plasa prima ta comandă pe LongevityFarma, istoricul și detaliile de urmărire vor apărea aici.
          </p>
          <a href="/" className={styles.actionLink}>
            Începe cumpărăturile
          </a>
        </div>
      ) : (
        <div className={styles.premiumCard}>
          <div className={styles.cardHeader}>Ai {orders.length} comenzi</div>
          {/* Here you could map through the orders array */}
        </div>
      )}
    </div>
  );
}
