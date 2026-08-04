'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import styles from '@/app/produs/[slug]/ProductPage.module.css';

interface AddToCartButtonProps {
  productSlug: string;
  price: number;
}

export default function AddToCartButton({ productSlug, price }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    const result = await addToCart(productSlug, price, 1);
    
    if (result.error) {
      alert(result.error);
    } else {
      setShowPopup(true);
    }
    
    setLoading(false);
  };

  return (
    <>
      <button 
        className={styles.btnAddToCart} 
        onClick={handleAddToCart}
        disabled={loading}
        style={{ opacity: loading ? 0.7 : 1 }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        {loading ? 'Se adaugă...' : 'Adaugă în Coș'}
      </button>

      {showPopup && (
        <div className={styles.modalOverlay} onClick={() => setShowPopup(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className={styles.modalTitle}>Produs adăugat în coș!</h3>
            </div>
            
            <div className={styles.modalButtons}>
              <Link href="/cart" className={styles.btnCart}>
                Spre coșul meu
              </Link>
              <button className={styles.btnContinue} onClick={() => setShowPopup(false)}>
                Continuă cumpărăturile
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
