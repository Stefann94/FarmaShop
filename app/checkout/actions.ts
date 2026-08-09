'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Forma unui produs așa cum vine din coșul clientului (localStorage sau context).
// Adnotare pură de tip: TypeScript o șterge la compilare, codul executat nu se schimbă.
type ClientCartItem = {
  product_slug: string
  quantity: number
  price?: number
  name?: string
}

export async function processCheckout(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Get cart items from form data (JSON string passed from client)
  const guestCartRaw = formData.get('guestCartItems') as string
  let clientCartItems: ClientCartItem[] = []
  if (guestCartRaw) {
    try {
      clientCartItems = JSON.parse(guestCartRaw)
    } catch (e) {
      console.error('Eroare parsare guestCartItems', e)
    }
  }

  if (!clientCartItems || clientCartItems.length === 0) {
    return { error: 'Coșul este gol sau a apărut o eroare.' }
  }

  // 2. Fetch product details from DB to ensure prices are secure (not tampered)
  const slugs = clientCartItems.map((item: any) => item.product_slug)
  const { data: products } = await supabase
    .from('products')
    .select('slug, name, price')
    .in('slug', slugs)
  
  const productsMap = new Map(products?.map(p => [p.slug, p]))

  const secureCartItems = clientCartItems.map((item: any) => {
    const p = productsMap.get(item.product_slug)
    return {
      product_slug: item.product_slug,
      quantity: item.quantity,
      price: p?.price || item.price,
      product_name: p?.name || item.name || item.product_slug
    }
  })

  // 3. Calculate Total
  const FREE_SHIPPING_THRESHOLD = 200
  const STANDARD_SHIPPING_COST = 19.99

  const itemsTotal = secureCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const shippingCost = itemsTotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST
  const finalTotal = itemsTotal + shippingCost

  // 4. Extract Shipping Info
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

  const orderId = crypto.randomUUID()

  // 5. Create Order
  const { error: orderError } = await supabase
    .from('orders')
    .insert({
      id: orderId,
      user_id: user?.id || null,
      total_amount: finalTotal,
      shipping_cost: shippingCost,
      shipping_name: fullName,
      shipping_phone: phone,
      shipping_address: fullAddress,
      status: 'În procesare'
    })

  if (orderError) {
    console.error('Order creation error:', orderError)
    if (orderError.message.includes('foreign key constraint') || orderError.message.includes('null value in column "user_id"')) {
       return { error: 'Pentru a permite comenzi fara cont, trebuie eliminata restrictia NOT NULL pentru coloana user_id din tabelul orders in Supabase.' }
    }
    return { error: `Eroare Supabase: ${orderError.message}` }
  }

  const orderItemsData = secureCartItems.map(item => ({
    order_id: orderId,
    product_slug: item.product_slug,
    product_name: item.product_name,
    quantity: item.quantity,
    price_at_time: item.price,
    price: item.price 
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData)

  if (itemsError) {
    console.error('Order items error:', itemsError)
    return { error: `Eroare salvare produse: ${itemsError.message}` }
  }

  // 6. Clear DB Cart if authenticated
  if (user) {
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
  }

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
        <h2 style="color: #2e8b57;">Confirmare Comandă Longevity Farma</h2>
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

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Longevity Farma <onboarding@resend.dev>',
      to: [email],
      subject: `Confirmare Comandă #${orderId.split('-')[0]} - Longevity Farma`,
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
