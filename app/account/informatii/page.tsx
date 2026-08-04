import React from 'react';
import styles from '../Account.module.css';
import { createClient } from '@/lib/supabase/server';
import ProfileForm from './ProfileForm';

export default async function PersonalInfoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Neautorizat</div>;
  }

  // Fetch from profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const initialData = {
    first_name: profile?.first_name || user.user_metadata?.first_name || '',
    last_name: profile?.last_name || user.user_metadata?.last_name || '',
    email: user.email || '',
    phone: profile?.phone || '',
  };

  return (
    <div>
      <h2 className={styles.heroTitle} style={{ marginBottom: '30px' }}>Informații <strong>cont</strong></h2>
      <ProfileForm initialData={initialData} />
    </div>
  );
}
