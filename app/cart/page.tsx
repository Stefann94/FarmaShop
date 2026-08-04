import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CartClient from './CartClient'
import ProductCarousel from '@/components/ProductCarousel'
import styles from './Cart.module.css'

export const metadata = {
  title: 'Coșul meu | FarmaShop',
  description: 'Coșul tău de cumpărături FarmaShop',
}

export default async function CartPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch Recommended Products for the Carousel below the cart
  const { data: recommendedProducts } = await supabase
    .from('products')
    .select('id, name, slug, image_url, price')
    .limit(8)

  return (
    <div>
      <CartClient />
      
      {recommendedProducts && recommendedProducts.length > 0 && (
        <div className={styles.cartWrapper} style={{ paddingTop: 0 }}>
          <div className={styles.recommendedSection}>
            <ProductCarousel 
              title={<span className={styles.recommendedTitle}>Produse alese pentru tine</span>} 
              products={recommendedProducts} 
            />
          </div>
        </div>
      )}
    </div>
  )
}
