"use client";

import React from 'react';
import { useFavorites } from '@/app/context/FavoritesContext';

interface FavoriteButtonProps {
  productSlug: string;
  className?: string;
}

export default function FavoriteButton({ productSlug, className }: FavoriteButtonProps) {
  const { favoriteItems, toggleFavorite } = useFavorites();
  const isFav = favoriteItems.some(f => f.product_slug === productSlug);

  return (
    <button 
      className={className} 
      aria-label="Adauga la favorite"
      onClick={(e) => { 
        e.preventDefault(); 
        e.stopPropagation();
        toggleFavorite(productSlug); 
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </button>
  );
}
