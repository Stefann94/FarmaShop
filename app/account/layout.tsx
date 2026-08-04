import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import SidebarClient from './SidebarClient';
import styles from './Account.module.css';

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className={styles.accountWrapper}>
      
      <div className={styles.accountGrid}>
        <SidebarClient />
        
        <main className={styles.contentArea}>
          {children}
        </main>
      </div>
    </div>
  );
}
