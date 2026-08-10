'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Textul vine în întregime de la un vizitator neautentificat și ajunge într-un
 * email HTML. Fără escapare, cineva ar putea injecta linkuri sau markup în
 * mesajul pe care îl primești tu în inbox.
 */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Trimite notificarea către adresa personală configurată în
 * CONTACT_NOTIFICATION_EMAIL.
 *
 * Eșecul este intenționat înghițit: mesajul este deja salvat în baza de date în
 * momentul apelului, deci un email care nu pleacă nu trebuie să-i arate
 * vizitatorului o eroare și nici să piardă mesajul.
 */
async function sendContactNotification(fields: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const destination = process.env.CONTACT_NOTIFICATION_EMAIL;

  if (!destination) {
    console.warn(
      'CONTACT_NOTIFICATION_EMAIL nu este setat: mesajul a fost salvat, dar nu s-a trimis nicio notificare.'
    );
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY nu este setat: notificarea de contact nu a fost trimisa.');
    return;
  }

  const safe = {
    name: escapeHtml(fields.name),
    email: escapeHtml(fields.email),
    subject: escapeHtml(fields.subject),
    // Mesajul e scris pe mai multe rânduri într-un textarea; fără asta ar
    // ajunge un bloc compact în email.
    message: escapeHtml(fields.message).replace(/\r?\n/g, '<br />'),
  };

  const receivedAt = new Date().toLocaleString('ro-RO', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Bucharest',
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a2b22;">
      <h2 style="color: #2e8b57; margin-bottom: 4px;">Mesaj nou din formularul de contact</h2>
      <p style="color: #777; font-size: 13px; margin-top: 0;">Primit pe ${receivedAt}</p>

      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #777; width: 110px;">Nume</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600;">${safe.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #777;">E-mail</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600;">
            <a href="mailto:${safe.email}" style="color: #2e8b57;">${safe.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #777;">Subiect</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600;">${safe.subject}</td>
        </tr>
      </table>

      <div style="background-color: #f4f8f1; border: 1px solid #d6e4d9; border-radius: 8px; padding: 18px;">
        <div style="color: #777; font-size: 13px; margin-bottom: 10px;">Mesaj</div>
        <div style="line-height: 1.6;">${safe.message}</div>
      </div>

      <p style="color: #777; font-size: 13px; margin-top: 24px;">
        Poți răspunde direct la acest email: destinatarul va fi ${safe.name}.
      </p>
    </div>
  `;

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: 'Contact Longevity Farma <onboarding@resend.dev>',
      to: [destination],
      // Un simplu Reply în clientul de email răspunde persoanei, nu ție.
      replyTo: fields.email,
      subject: `[Contact] ${fields.subject} — ${fields.name}`,
      html,
    });

    if (error) {
      console.error('Eroare la trimiterea notificarii de contact:', error);
    }
  } catch (err) {
    console.error('Eroare generala la notificarea de contact:', err);
  }
}

export async function submitContactMessage(formData: FormData) {
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const subject = formData.get('subject')?.toString().trim();
  const message = formData.get('message')?.toString().trim();

  if (!name || !email || !message) {
    return { success: false, error: 'Te rugăm să completezi toate câmpurile obligatorii.' };
  }

  // Validarea din formular este doar în browser. Emailul ajunge în antetul
  // Reply-To, deci o valoare stricată ar face ca trimiterea să fie respinsă.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Adresa de e-mail nu pare validă.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('contact_messages').insert([
    { name, email, subject, message }
  ]);

  if (error) {
    console.error('Failed to submit contact message:', error);
    return { success: false, error: 'A apărut o eroare la trimiterea mesajului. Te rugăm să încerci din nou.' };
  }

  // Abia după ce mesajul e salvat în siguranță. Dacă notificarea nu pleacă,
  // mesajul rămâne oricum în tabelul contact_messages.
  await sendContactNotification({
    name,
    email,
    subject: subject || 'Fără subiect',
    message,
  });

  return { success: true };
}
