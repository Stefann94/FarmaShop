'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { fetchCart, addToCartDB, removeCartItemDB } from '@/app/cart/actions'

export type CartItem = {
  id: string
  product_slug: string
  quantity: number
  price: number
}

interface CartContextType {
  cartItems: CartItem[]
  cartCount: number
  cartTotal: number
  isLoading: boolean
  addToCart: (productSlug: string, price: number, quantity?: number) => Promise<{ error?: string; success?: boolean }>
  removeFromCart: (productSlug: string) => Promise<{ error?: string; success?: boolean }>
  refreshCart: () => Promise<void>
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

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, isLoading, addToCart, removeFromCart, refreshCart }}>
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
