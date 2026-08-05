'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { fetchFavorites, toggleFavoriteDB } from '@/app/favorites/actions'

export type FavoriteItem = {
  id: string
  product_slug: string
  name?: string
  image_url?: string
  price?: number
}

interface FavoritesContextType {
  favoriteItems: FavoriteItem[]
  favoriteCount: number
  isLoading: boolean
  toggleFavorite: (productSlug: string) => Promise<{ error?: string; success?: boolean; action?: string }>
  refreshFavorites: () => Promise<void>
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshFavorites = async () => {
    setIsLoading(true)
    const result = await fetchFavorites()
    setFavoriteItems(result.items || [])
    setIsLoading(false)
  }

  useEffect(() => {
    refreshFavorites()
  }, [])

  const toggleFavorite = async (productSlug: string) => {
    const result = await toggleFavoriteDB(productSlug)
    if (result.success) {
      await refreshFavorites()
    }
    return result
  }

  const clearFavorites = () => {
    setFavoriteItems([])
  }

  return (
    <FavoritesContext.Provider value={{
      favoriteItems,
      favoriteCount: favoriteItems.length,
      isLoading,
      toggleFavorite,
      refreshFavorites,
      clearFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
