import React from 'react';
import styles from '../Account.module.css';
import { createClient } from '@/lib/supabase/server';
import AddressForm from './AddressForm';

export default async function AddressesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div>Neautorizat</div>;

  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id);

  const shipping = addresses?.find(a => a.type === 'shipping');
  const billing = addresses?.find(a => a.type === 'billing');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 className={styles.heroTitle} style={{ marginBottom: 0 }}>Agenda de <strong>adrese</strong></h2>
      </div>
      
      <div className={styles.dashboardGrid}>
        <AddressForm 
          type="shipping"
          title="Adresă de livrare implicită"
          description="Nu ai setat nicio adresă de livrare. Adaugă o adresă pentru o finalizare mai rapidă a comenzilor viitoare."
          initialData={shipping}
        />

        <AddressForm 
          type="billing"
          title="Adresă de facturare implicită"
          description="Nu ai setat nicio adresă de facturare. Aceasta va fi folosită pentru emiterea facturilor fiscale."
          initialData={billing}
        />
      </div>
    </div>
  );
}
