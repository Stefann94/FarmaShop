'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { fetchCart, addToCartDB, removeCartItemDB, updateCartItemQuantityDB, fetchProductsDetailsBySlugs } from '@/app/cart/actions'

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
  addToCart: (productSlug: string, price: number, quantity?: number) => Promise<{ error?: string; success?: boolean; notAuthenticated?: boolean }>
  removeFromCart: (productSlug: string) => Promise<{ error?: string; success?: boolean; notAuthenticated?: boolean }>
  updateQuantity: (productSlug: string, quantity: number) => Promise<{ error?: string; success?: boolean; notAuthenticated?: boolean }>
  refreshCart: () => Promise<void>
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const GUEST_CART_KEY = 'farmashop_guest_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  const getLocalCart = (): CartItem[] => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(GUEST_CART_KEY)
      if (stored) return JSON.parse(stored)
    }
    return []
  }

  const saveLocalCart = (items: CartItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
    }
  }

  const refreshCart = async () => {
    setIsLoading(true)
    const result = await fetchCart()
    
    if (result.notAuthenticated || result.error === 'Not authenticated') {
      setIsGuest(true)
      const localCart = getLocalCart()
      
      // Fetch fresh details (name, image, price) for local cart items
      if (localCart.length > 0) {
        const slugs = localCart.map(item => item.product_slug)
        const productsDetails = await fetchProductsDetailsBySlugs(slugs)
        const productsMap = new Map(productsDetails.map((p: any) => [p.slug, p]))
        
        const enrichedLocalCart = localCart.map(item => {
          const product = productsMap.get(item.product_slug)
          return {
            ...item,
            name: product?.name || 'Produs',
            image_url: product?.image_url || '/placeholder.png',
            price: product?.price || item.price // keep price synced with DB
          }
        })
        setCartItems(enrichedLocalCart)
        saveLocalCart(enrichedLocalCart) // resave with updated prices
      } else {
        setCartItems([])
      }
    } else {
      setIsGuest(false)
      setCartItems(result.items || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    refreshCart()
  }, [])

  const addToCart = async (productSlug: string, price: number, quantity: number = 1) => {
    const result = await addToCartDB(productSlug, price, quantity)
    
    // Fallback to guest cart if not authenticated
    if (result.notAuthenticated) {
      let localCart = getLocalCart()
      const existing = localCart.find(item => item.product_slug === productSlug)
      if (existing) {
        existing.quantity += quantity
      } else {
        localCart.push({
          id: `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          product_slug: productSlug,
          quantity,
          price
        })
      }
      saveLocalCart(localCart)
      await refreshCart() // this will enrich with name/image
      return { success: true }
    }

    if (result.success) {
      await refreshCart()
    }
    return result
  }

  const removeFromCart = async (productSlug: string) => {
    const result = await removeCartItemDB(productSlug)
    
    if (result.notAuthenticated) {
      let localCart = getLocalCart()
      localCart = localCart.filter(item => item.product_slug !== productSlug)
      saveLocalCart(localCart)
      await refreshCart()
      return { success: true }
    }

    if (result.success) {
      await refreshCart()
    }
    return result
  }

  const updateQuantity = async (productSlug: string, quantity: number) => {
    // Optimistic UI update
    setCartItems(prev => prev.map(item => item.product_slug === productSlug ? { ...item, quantity } : item).filter(item => item.quantity > 0));
    
    const result = await updateCartItemQuantityDB(productSlug, quantity)
    
    if (result.notAuthenticated) {
      let localCart = getLocalCart()
      if (quantity <= 0) {
        localCart = localCart.filter(item => item.product_slug !== productSlug)
      } else {
        localCart = localCart.map(item => item.product_slug === productSlug ? { ...item, quantity } : item)
      }
      saveLocalCart(localCart)
      return { success: true }
    }

    if (!result.success) {
      // Revert if error
      await refreshCart()
    }
    return result
  }

  const clearCart = () => {
    if (isGuest) {
      saveLocalCart([])
    }
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
