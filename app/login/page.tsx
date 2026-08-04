import styles from '../auth/Auth.module.css';

export const metadata = {
  title: 'Autentificare | FarmaShop',
  description: 'Intră în contul tău FarmaShop',
};

export default function LoginPage() {
  return (
    <main className={styles.pageWrapper}>
      <div className={styles.authCard}>
        <div className={styles.logoWrapper}>
          <svg className={styles.logoIcon} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 1 8.3C19.24 16.46 13.84 20 11 20Z"/>
            <path d="M11 20c2-5 0-11-2-11"/>
          </svg>
        </div>
        <h1>Bine ai revenit!</h1>
        <p className={styles.authSubtitle}>Autentifică-te pentru a continua cumpărăturile.</p>
        
        <form>
          <div className={styles.formGroup}>
            <label htmlFor="email">E-mail sau Număr de telefon</label>
            <input type="text" id="email" placeholder="nume@exemplu.ro sau 07xx..." required />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Parolă</label>
            <input type="password" id="password" placeholder="••••••••" required />
          </div>
          
          <button type="submit" className={styles.authButton}>
            Intră în cont
          </button>
        </form>
        
        <div className={styles.authFooter}>
          Nu ai încă un cont? <a href="/signup">Creează unul acum</a>
        </div>
      </div>
    </main>
  );
}
