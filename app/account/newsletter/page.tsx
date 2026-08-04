import React from 'react';
import styles from '../Account.module.css';
import { createClient } from '@/lib/supabase/server';
import NewsletterSwitch from './NewsletterSwitch';

export default async function NewsletterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div>Neautorizat</div>;

  const { data: subscription } = await supabase
    .from('newsletter_subscriptions')
    .select('is_subscribed')
    .eq('user_id', user.id)
    .single();

  const isSubscribed = subscription?.is_subscribed || false;

  return (
    <div>
      <h2 className={styles.heroTitle} style={{ marginBottom: '30px' }}>Abonare la <strong>newsletter</strong></h2>
      
      <div className={styles.premiumCard}>
        <div className={styles.cardHeader}>Setări Comunicare</div>
        <p className={styles.cardContent} style={{ marginBottom: '30px' }}>
          Abonează-te pentru a primi cele mai noi articole despre longevitate, oferte exclusive și noutăți despre produsele noastre.
        </p>

        <NewsletterSwitch initialSubscribed={isSubscribed} />
      </div>
    </div>
  );
}
