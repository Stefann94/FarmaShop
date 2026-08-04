import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CheckoutClient from './CheckoutClient'

export const metadata = {
  title: 'Finalizare Comandă | FarmaShop',
}

export default async function CheckoutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 1. Fetch Cart Items
  const { data: cartItems } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', user.id)

  if (!cartItems || cartItems.length === 0) {
    redirect('/cart')
  }

  // Fetch product names for display
  const slugs = cartItems.map(item => item.product_slug)
  const { data: products } = await supabase
    .from('products')
    .select('slug, name')
    .in('slug', slugs)
  
  const productsMap = new Map(products?.map(p => [p.slug, p.name]))

  const enrichedCart = cartItems.map(item => ({
    id: item.id,
    product_slug: item.product_slug,
    name: productsMap.get(item.product_slug) || item.product_slug,
    quantity: item.quantity,
    price: item.price
  }))

  // 2. Fetch Profile Info
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profileData = {
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    email: user.email || ''
  }

  // 3. Fetch Shipping Address
  const { data: address } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .eq('type', 'shipping')
    .single()

  const addressData = address ? {
    street: address.street,
    city: address.city,
    county: address.county,
    postal_code: address.postal_code
  } : null

  return (
    <CheckoutClient 
      cartItems={enrichedCart}
      profile={profileData}
      address={addressData}
    />
  )
}
