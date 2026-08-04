'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function processCheckout(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // 1. Get current cart items
  const { data: cartItems, error: cartError } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', user.id)

  if (cartError || !cartItems || cartItems.length === 0) {
    return { error: 'Coșul este gol sau a apărut o eroare.' }
  }

  // Fetch product names for order_items
  const slugs = cartItems.map(item => item.product_slug)
  const { data: products } = await supabase
    .from('products')
    .select('slug, name')
    .in('slug', slugs)
  
  const productsMap = new Map(products?.map(p => [p.slug, p.name]))

  // 2. Calculate Total
  const FREE_SHIPPING_THRESHOLD = 200
  const STANDARD_SHIPPING_COST = 19.99

  const itemsTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const shippingCost = itemsTotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST
  const finalTotal = itemsTotal + shippingCost

  // 3. Extract Shipping Info
  const firstName = formData.get('first_name') as string
  const lastName = formData.get('last_name') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const street = formData.get('street') as string
  const city = formData.get('city') as string
  const county = formData.get('county') as string
  const zip = formData.get('zip') as string

  const fullName = `${firstName} ${lastName}`
  const fullAddress = `${street}, ${city}, ${county}, ${zip}`

  // 4. Create Order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total_amount: finalTotal,
      shipping_cost: shippingCost,
      shipping_name: fullName,
      shipping_phone: phone,
      shipping_address: fullAddress,
      status: 'În procesare'
    })
    .select()
    .single()

  if (orderError) {
    console.error('Order creation error:', orderError)
    return { error: `Eroare Supabase: ${orderError.message}` }
  }

  const orderItemsData = cartItems.map(item => ({
    order_id: order.id,
    product_slug: item.product_slug,
    product_name: productsMap.get(item.product_slug) || item.product_slug,
    quantity: item.quantity,
    price_at_time: item.price,
    price: item.price // Adăugat pentru a satisface constrângerea NOT NULL a coloanei 'price'
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData)

  if (itemsError) {
    console.error('Order items error:', itemsError)
    return { error: `Eroare salvare produse: ${itemsError.message}` }
  }

  // 6. Clear Cart
  await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)

  // 7. Revalidate paths
  revalidatePath('/cart')
  revalidatePath('/account/comenzi')

  // 8. Send Email using Resend
  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Generăm lista de produse formatată HTML
    const itemsHtml = orderItemsData.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.product_name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${item.price_at_time} Lei</td>
      </tr>
    `).join('');

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2e8b57;">Confirmare Comandă FarmaShop</h2>
        <p>Salut, <strong>${firstName}</strong>!</p>
        <p>Îți mulțumim pentru comandă. Mai jos regăsești detaliile cumpărăturilor tale:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Produs</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Cantitate</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Preț/buc</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <p style="text-align: right; font-size: 16px;">Transport: <strong>${shippingCost === 0 ? 'GRATUIT' : shippingCost + ' Lei'}</strong></p>
        <h3 style="text-align: right; color: #1a2b22;">Total: ${finalTotal.toFixed(2)} Lei</h3>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 30px;">
          <h4 style="margin-top: 0; color: #333;">Adresa de livrare:</h4>
          <p style="margin: 0; color: #555;">${fullAddress}</p>
          <p style="margin: 5px 0 0 0; color: #555;">Telefon: ${phone}</p>
        </div>
      </div>
    `;

    // Atenție: Dintr-un cont Resend gratuit (fără domeniu verificat), poți trimite email-uri doar la adresa ta de email cu care ți-ai făcut contul Resend!
    // Dacă email-ul clientului e diferit, email-ul va fi respins. Pentru testare, poți pune email-ul tău la `to: ...`.
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'FarmaShop <onboarding@resend.dev>',
      to: [email],
      subject: `Confirmare Comandă #${order.id.split('-')[0]} - FarmaShop`,
      html: emailHtml,
    });

    if (emailError) {
      console.error('Eroare la trimitere email:', emailError);
    } else {
      console.log(`[EMAIL] Trimis cu succes către ${email}:`, emailData);
    }
  } catch (err) {
    console.error('Eroare generală email:', err);
  }

  return { success: true }
}
