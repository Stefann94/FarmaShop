import styles from '../auth/Auth.module.css';

export const metadata = {
  title: 'Creare Cont | FarmaShop',
  description: 'Creează un cont nou pe FarmaShop',
};

export default function SignupPage() {
  return (
    <main className={styles.pageWrapper}>
      <h1 className={styles.pageTitle}>Creare Cont Nou</h1>
      
      <form className={styles.classicForm}>
        <div className={styles.formColumns}>
          
          <div className={styles.formSection}>
            <h2>Informații personale</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="firstName">Prenume <span>*</span></label>
              <input type="text" id="firstName" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="lastName">Nume de familie <span>*</span></label>
              <input type="text" id="lastName" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phone">Număr de telefon</label>
              <input type="tel" id="phone" />
            </div>
          </div>

          <div className={styles.formSection}>
            <h2>Date de logare</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">E-mail <span>*</span></label>
              <input type="email" id="email" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Parolă <span>*</span></label>
              <input type="password" id="password" required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirmare parolă <span>*</span></label>
              <input type="password" id="confirmPassword" required />
            </div>
          </div>
          
        </div>
        
        <div className={styles.formActions}>
          <a href="/login" className={styles.backLink}>Înapoi</a>
          <button type="submit" className={styles.submitBtn}>
            Creează cont
          </button>
        </div>
      </form>
    </main>
  );
}
