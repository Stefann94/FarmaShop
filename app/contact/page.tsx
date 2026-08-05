import React from 'react';
import authStyles from '../auth/Auth.module.css';
import ContactForm from './ContactForm';

export const metadata = {
  title: 'Contact | Longevity Farma',
  description: 'Ai întrebări despre suplimentele noastre sau despre comanda ta? Contactează echipa Longevity Farma.',
};

export default function ContactPage() {
  return (
    <main className={authStyles.pageWrapper}>
      <h1 className={authStyles.pageTitle}>Contact</h1>
      
      <div className={authStyles.formColumns}>
        
        {/* INFO PANEL */}
        <div>
          <div className={authStyles.formSection}>
            <h2>Informații de Contact</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.95rem', color: '#555' }}>
              <div>
                <strong style={{ display: 'block', color: '#333', marginBottom: '5px' }}>Email</strong>
                office@longevityfarma.ro
              </div>
              <div>
                <strong style={{ display: 'block', color: '#333', marginBottom: '5px' }}>Telefon</strong>
                +40 (700) 123 456
              </div>
              <div>
                <strong style={{ display: 'block', color: '#333', marginBottom: '5px' }}>Adresă Sediu</strong>
                Piatra Neamț, România
              </div>
              <div>
                <strong style={{ display: 'block', color: '#333', marginBottom: '5px' }}>Program</strong>
                Luni - Vineri: 09:00 - 17:00
              </div>
            </div>
          </div>
        </div>

        {/* FORM PANEL */}
        <div>
          <ContactForm />
        </div>
        
      </div>
    </main>
  );
}
