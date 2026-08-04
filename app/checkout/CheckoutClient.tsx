'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Checkout.module.css'
import { processCheckout } from './actions'

interface CartItem {
  id: string
  product_slug: string
  name: string
  quantity: number
  price: number
}

interface ProfileData {
  first_name: string
  last_name: string
  phone: string
  email: string
}

interface AddressData {
  street: string
  city: string
  county: string
  postal_code: string
}

interface CheckoutClientProps {
  cartItems: CartItem[]
  profile: ProfileData
  address: AddressData | null
}

import { useCart } from '@/app/context/CartContext'

export default function CheckoutClient({ cartItems, profile, address }: CheckoutClientProps) {
  const router = useRouter()
  const { clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const itemsTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const FREE_SHIPPING_THRESHOLD = 200
  const STANDARD_SHIPPING_COST = 19.99
  const shippingCost = itemsTotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST
  const finalTotal = itemsTotal + shippingCost

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')

    const formData = new FormData(e.currentTarget)
    const result = await processCheckout(formData)

    if (result.error) {
      setErrorMsg(result.error)
      setIsSubmitting(false)
    } else if (result.success) {
      clearCart()
      router.push('/checkout/succes')
    }
  }

  return (
    <div className={styles.checkoutWrapper}>
      <h1 className={styles.checkoutTitle}>Finalizare Comandă</h1>

      <form onSubmit={handleSubmit} className={styles.checkoutGrid}>
        {/* Left Form */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Date de Livrare</h2>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Prenume</label>
              <input type="text" name="first_name" defaultValue={profile.first_name} required className={styles.input} />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Nume</label>
              <input type="text" name="last_name" defaultValue={profile.last_name} required className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Telefon</label>
              <input type="tel" name="phone" defaultValue={profile.phone} required className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>E-mail</label>
              <input type="email" name="email" defaultValue={profile.email} required className={styles.input} readOnly />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Adresă (Stradă, număr, bloc, apartament)</label>
              <input type="text" name="street" defaultValue={address?.street || ''} required className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Oraș</label>
              <input type="text" name="city" defaultValue={address?.city || ''} required className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Județ</label>
              <input type="text" name="county" defaultValue={address?.county || ''} required className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Cod Poștal</label>
              <input type="text" name="zip" defaultValue={address?.postal_code || ''} required className={styles.input} />
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className={styles.summarySection}>
          <h2 className={styles.sectionTitle}>Sumar Comandă</h2>
          
          <div className={styles.summaryList}>
            {cartItems.map(item => (
              <div key={item.id} className={styles.summaryItem}>
                <span className={styles.itemName}>{item.quantity}x {item.name}</span>
                <span className={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} Lei</span>
              </div>
            ))}
          </div>

          <div className={styles.divider}></div>

          <div className={styles.totalsRow}>
            <span>Subtotal:</span>
            <span>{itemsTotal.toFixed(2)} Lei</span>
          </div>
          
          <div className={styles.totalsRow}>
            <span>Transport:</span>
            <span>{shippingCost === 0 ? <span className={styles.freeText}>GRATUIT</span> : `${shippingCost} Lei`}</span>
          </div>

          <div className={`${styles.totalsRow} ${styles.grandTotal}`}>
            <span>Total de plată:</span>
            <span>{finalTotal.toFixed(2)} Lei</span>
          </div>

          {errorMsg && (
            <div className={styles.errorBox}>{errorMsg}</div>
          )}

          <button type="submit" disabled={isSubmitting} className={styles.confirmButton}>
            {isSubmitting ? 'Se procesează...' : 'Confirmă Comanda'}
          </button>
        </div>
      </form>
    </div>
  )
}
