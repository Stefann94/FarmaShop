'use client'

import React, { useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import styles from '@/app/produs/[slug]/ProductPage.module.css'; // Adjust the import if needed, but since it uses specific styles, maybe pass className or duplicate

interface AddToCartButtonProps {
  productSlug: string;
  price: number;
}

export default function AddToCartButton({ productSlug, price }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    const result = await addToCart(productSlug, price, 1);
    
    if (result.error) {
      alert(result.error);
    }
    
    setLoading(false);
  };

  return (
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
  );
}
