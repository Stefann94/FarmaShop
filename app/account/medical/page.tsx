import React from 'react';
import styles from '../Account.module.css';
import { createClient } from '@/lib/supabase/server';
import MedicalForm from './MedicalForm';

export default async function MedicalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div>Neautorizat</div>;

  const { data: medical } = await supabase
    .from('medical_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const initialData = {
    allergies: medical?.allergies || '',
    current_treatments: medical?.current_treatments || '',
  };

  return (
    <div>
      <h2 className={styles.heroTitle} style={{ marginBottom: '30px' }}>Informații <strong>medicale</strong></h2>
      <MedicalForm initialData={initialData} />
    </div>
  );
}
