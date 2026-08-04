import styles from '../auth/Auth.module.css';

export const metadata = {
  title: 'Autentificare | FarmaShop',
  description: 'Intră în contul tău FarmaShop',
};

export default function LoginPage() {
  return (
    <main className={`${styles.pageWrapper} ${styles.loginPageWrapper}`}>
      <div className={styles.loginContainer}>
        <h1 className={styles.pageTitle}>Autentificare Cont</h1>
        
        <form className={styles.classicForm}>
          <div className={styles.formSection}>
            <h2>Date de conectare</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">E-mail sau Număr de telefon <span>*</span></label>
              <input type="text" id="email" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Parolă <span>*</span></label>
              <input type="password" id="password" required />
            </div>
            
            <div className={styles.formActions}>
              <a href="/signup" className={styles.backLink}>Creare cont nou</a>
              <button type="submit" className={styles.submitBtn}>
                Autentificare
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
