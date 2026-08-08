import React from 'react'
import { createClient } from '@/lib/supabase/server'
import CheckoutClient from './CheckoutClient'

export const metadata = {
  title: 'Finalizare Comandă | FarmaShop',
}

export default async function CheckoutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profileData = {
    first_name: '',
    last_name: '',
    phone: '',
    email: ''
  }
  let addressData = null

  if (user) {
    // Fetch Profile Info
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profile) {
      profileData = {
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        email: user.email || ''
      }
    }

    // Fetch Shipping Address
    const { data: address } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'shipping')
      .single()

    if (address) {
      addressData = {
        street: address.street,
        city: address.city,
        county: address.county,
        postal_code: address.postal_code
      }
    }
  }

  return (
    <CheckoutClient 
      profile={profileData}
      address={addressData}
    />
  )
}
