import styles from '../auth/Auth.module.css';

export const metadata = {
  title: 'Creare Cont | FarmaShop',
  description: 'Creează un cont nou pe FarmaShop',
};

export default function SignupPage() {
  return (
    <main className={styles.pageWrapper}>
      <div className={styles.authCard}>
        <div className={styles.logoWrapper}>
          <svg className={styles.logoIcon} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 1 8.3C19.24 16.46 13.84 20 11 20Z"/>
            <path d="M11 20c2-5 0-11-2-11"/>
          </svg>
        </div>
        <h1>Creare Cont</h1>
        <p className={styles.authSubtitle}>Devino membru pentru beneficii exclusive și comenzi rapide.</p>
        
        <form>
          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
              <label htmlFor="firstName">Prenume</label>
              <input type="text" id="firstName" placeholder="Ion" required />
            </div>
            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
              <label htmlFor="lastName">Nume de familie</label>
              <input type="text" id="lastName" placeholder="Popescu" required />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
              <label htmlFor="email">E-mail</label>
              <input type="email" id="email" placeholder="nume@exemplu.ro" required />
            </div>
            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
              <label htmlFor="phone">Număr de telefon</label>
              <input type="tel" id="phone" placeholder="07xx xxx xxx" required />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
              <label htmlFor="password">Parolă</label>
              <input type="password" id="password" placeholder="Minim 8 caractere" required />
            </div>
            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
              <label htmlFor="confirmPassword">Confirmă Parola</label>
              <input type="password" id="confirmPassword" placeholder="Rescrie parola" required />
            </div>
          </div>
          
          <button type="submit" className={styles.authButton}>
            Creează Contul
          </button>
        </form>
        
        <div className={styles.authFooter}>
          Ai deja un cont? <a href="/login">Autentifică-te aici</a>
        </div>
      </div>
    </main>
  );
}
