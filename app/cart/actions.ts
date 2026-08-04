'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function fetchCart() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { items: [] }

  const { data: cartItems, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch Cart Error:', error)
    return { items: [] }
  }

  if (!cartItems || cartItems.length === 0) {
    return { items: [] }
  }

  // Fetch product details
  const slugs = cartItems.map(item => item.product_slug)
  const { data: products } = await supabase
    .from('products')
    .select('slug, name, image_url')
    .in('slug', slugs)

  const productsMap = new Map(products?.map(p => [p.slug, p]))

  const enrichedItems = cartItems.map(item => {
    const product = productsMap.get(item.product_slug)
    return {
      ...item,
      name: product?.name || 'Produs',
      image_url: product?.image_url || '/placeholder.png'
    }
  })

  return { items: enrichedItems }
}

export async function addToCartDB(productSlug: string, price: number, quantity: number = 1) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Trebuie să fii autentificat pentru a adăuga în coș.' }

  // Check if item already exists
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('product_slug', productSlug)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('cart_items')
      .update({
        quantity: existing.quantity + quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)

    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from('cart_items')
      .insert({
        user_id: user.id,
        product_slug: productSlug,
        quantity: quantity,
        price: price,
        updated_at: new Date().toISOString()
      })
      
    if (error) return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/produs/[slug]', 'page')
  return { success: true }
}

export async function removeCartItemDB(productSlug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)
    .eq('product_slug', productSlug)

  if (error) return { error: error.message }
  return { success: true }
}

export async function updateCartItemQuantityDB(productSlug: string, quantity: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated' }

  if (quantity <= 0) {
    return removeCartItemDB(productSlug)
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('product_slug', productSlug)

  if (error) return { error: error.message }
  return { success: true }
}
