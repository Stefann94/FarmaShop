'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { fetchCart, addToCartDB, removeCartItemDB, updateCartItemQuantityDB } from '@/app/cart/actions'

export type CartItem = {
  id: string
  product_slug: string
  quantity: number
  price: number
  name?: string
  image_url?: string
}

interface CartContextType {
  cartItems: CartItem[]
  cartCount: number
  cartTotal: number
  isLoading: boolean
  addToCart: (productSlug: string, price: number, quantity?: number) => Promise<{ error?: string; success?: boolean }>
  removeFromCart: (productSlug: string) => Promise<{ error?: string; success?: boolean }>
  updateQuantity: (productSlug: string, quantity: number) => Promise<{ error?: string; success?: boolean }>
  refreshCart: () => Promise<void>
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshCart = async () => {
    setIsLoading(true)
    const result = await fetchCart()
    setCartItems(result.items || [])
    setIsLoading(false)
  }

  useEffect(() => {
    refreshCart()
  }, [])

  const addToCart = async (productSlug: string, price: number, quantity: number = 1) => {
    const result = await addToCartDB(productSlug, price, quantity)
    if (result.success) {
      await refreshCart()
    }
    return result
  }

  const removeFromCart = async (productSlug: string) => {
    const result = await removeCartItemDB(productSlug)
    if (result.success) {
      await refreshCart()
    }
    return result
  }

  const updateQuantity = async (productSlug: string, quantity: number) => {
    // Optimistic UI update
    setCartItems(prev => prev.map(item => item.product_slug === productSlug ? { ...item, quantity } : item).filter(item => item.quantity > 0));
    
    const result = await updateCartItemQuantityDB(productSlug, quantity)
    if (!result.success) {
      // Revert if error
      await refreshCart()
    }
    return result
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, isLoading, addToCart, removeFromCart, updateQuantity, refreshCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
