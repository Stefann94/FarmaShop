'use server';

import { createClient } from '@/lib/supabase/server';

export async function submitContactMessage(formData: FormData) {
  const name = formData.get('name')?.toString();
  const email = formData.get('email')?.toString();
  const subject = formData.get('subject')?.toString();
  const message = formData.get('message')?.toString();

  if (!name || !email || !message) {
    return { success: false, error: 'Te rugăm să completezi toate câmpurile obligatorii.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('contact_messages').insert([
    { name, email, subject, message }
  ]);

  if (error) {
    console.error('Failed to submit contact message:', error);
    return { success: false, error: 'A apărut o eroare la trimiterea mesajului. Te rugăm să încerci din nou.' };
  }

  return { success: true };
}
