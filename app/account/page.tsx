import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import styles from './Account.module.css';

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Obținem informații adiționale
  const firstName = user?.user_metadata?.first_name || '';
  const lastName = user?.user_metadata?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const email = user?.email || '';

  // 1. Fetch addresses
  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id);
  const defaultShipping = addresses?.find(a => a.type === 'shipping');

  // 2. Fetch newsletter status
  const { data: newsletter } = await supabase
    .from('newsletter_subscriptions')
    .select('is_subscribed')
    .eq('user_id', user.id)
    .single();
  const isSubscribed = newsletter?.is_subscribed || false;

  return (
    <div className={styles.contentArea}>
      
      {/* Hero Banner */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>Bine ai venit, <strong>{firstName || 'în contul tău'}</strong>!</h2>
          <p className={styles.heroSubtitle}>Gestionează-ți datele personale, urmărește comenzile și descoperă noutățile.</p>
        </div>
        <img src="/images/zen_stones.png" alt="Zen Stones" className={styles.heroImage} />
      </div>

      <div className={styles.dashboardGrid}>
        
        {/* Contact Info Premium Card */}
        <div className={styles.premiumCard}>
          <div className={styles.iconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <div className={styles.cardHeader}>Date de Contact</div>
          <div className={styles.cardContent}>
            <strong>{fullName || 'Nume Nesetat'}</strong><br/>
            {email}
          </div>
          <a href="/account/informatii" className={styles.actionLink}>
            Modifică datele
          </a>
        </div>

        {/* Newsletter Premium Card */}
        <div className={styles.premiumCard}>
          <div className={styles.iconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </div>
          <div className={styles.cardHeader}>Newsletter</div>
          <div className={styles.cardContent}>
            {isSubscribed 
              ? 'Ești abonat la newsletter-ul nostru.' 
              : 'Nu ești abonat la newsletter-ul nostru.'}
          </div>
          <a href="/account/newsletter" className={styles.actionLink}>
            Gestionează abonarea
          </a>
        </div>

        {/* Address Premium Card */}
        <div className={styles.premiumCard}>
          <div className={styles.iconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>
          <div className={styles.cardHeader}>Adresă Principală</div>
          <div className={styles.cardContent}>
            {defaultShipping 
              ? `${defaultShipping.street}, ${defaultShipping.city}, ${defaultShipping.country}`
              : 'Nu ai configurat încă o adresă implicită pentru livrare.'}
          </div>
          <a href="/account/adrese" className={styles.actionLink}>
            {defaultShipping ? 'Modifică adresa' : 'Adaugă adresă'}
          </a>
        </div>

      </div>
    </div>
  );
}
