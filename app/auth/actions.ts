'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Leagă de contul tocmai autentificat comenzile plasate fără cont cu același
 * email confirmat. Potrivirea o face funcția `claim_guest_orders` din Postgres,
 * care ia emailul din sesiune, nu din client (vezi setup_guest_orders.sql).
 *
 * Eșecul este intenționat ignorat: dacă migrarea nu a fost încă rulată sau
 * apare orice altă eroare, autentificarea trebuie să reușească oricum.
 * Revendicarea se va face oricum la următoarea autentificare.
 */
async function claimGuestOrders(supabase: SupabaseClient) {
  try {
    const { data, error } = await supabase.rpc('claim_guest_orders')
    if (error) {
      console.warn('Revendicarea comenzilor fara cont a esuat:', error.message)
      return
    }
    if (data) {
      console.log(`[COMENZI] ${data} comanda/comenzi legate de cont.`)
      revalidatePath('/account/comenzi')
    }
  } catch (err) {
    console.warn('Revendicarea comenzilor fara cont a esuat:', err)
  }
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Extract email/phone and password.
  // Currently, the form asks for "E-mail sau Număr de telefon", but Supabase signInWithPassword primarily uses email.
  // We'll treat it as email for now.
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'E-mail și parolă sunt obligatorii.' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Return friendly error messages
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Date de conectare incorecte. Verifică e-mailul și parola.' }
    }
    return { error: error.message }
  }

  // Sesiunea există de aici încolo, deci comenzile plasate anterior fără cont
  // pot fi legate acum de el.
  await claimGuestOrders(supabase)

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string

  if (!email || !password || !firstName || !lastName) {
    return { error: 'Toate câmpurile obligatorii trebuie completate.' }
  }

  if (password !== confirmPassword) {
    return { error: 'Parolele nu coincid.' }
  }

  if (password.length < 6) {
    return { error: 'Parola trebuie să aibă cel puțin 6 caractere.' }
  }

  // Sign up with user metadata
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
      },
    },
  })

  if (error) {
    if (error.message.includes('User already registered')) {
      return { error: 'Acest e-mail este deja înregistrat.' }
    }
    return { error: error.message }
  }

  // After successful signup, redirect to home page or a confirmation page
  // Note: if email confirmation is enabled on Supabase, the user session won't be established here.

  // Contul tocmai creat poate prelua comenzile plasate anterior cu același
  // email. Dacă înregistrarea cere confirmare pe email, aici nu există încă
  // sesiune, apelul nu face nimic, iar comenzile vor fi preluate la prima
  // autentificare — de aceea revendicarea stă și în `login`.
  await claimGuestOrders(supabase)

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/')
}
