import React from 'react';
import styles from './Footer.module.css';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerTop}>
          <div className={styles.footerGrid}>
            
            {/* Coloana 1: Brand */}
            <div className={styles.footerCol}>
              <a href="#" className={styles.logo}>
                <svg className={styles.logoIcon} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 1 8.3C19.24 16.46 13.84 20 11 20Z"/>
                  <path d="M11 20c2-5 0-11-2-11"/>
                </svg>
                <div className={styles.logoTextWrapper}>
                  <div className={styles.logoText}>
                    Longevity<span className={styles.logoTextLight}>Farma</span>
                  </div>
                </div>
              </a>
              <p className={styles.brandDesc}>
                Investește astăzi în ziua de mâine. Suplimente premium bazate pe știință pentru vitalitate, focus și longevitate.
              </p>
              <div className={styles.socialLinks}>
                <a href="#" aria-label="Facebook"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                <a href="#" aria-label="Instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                <a href="#" aria-label="TikTok"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg></a>
              </div>
            </div>

            {/* Coloana 2: Informații Utile */}
            <div className={styles.footerCol}>
              <h4 className={styles.colTitle}>Informații Utile</h4>
              <ul className={styles.linkList}>
                <li><a href="#">Despre Noi</a></li>
                <li><a href="#">Termeni și Condiții</a></li>
                <li><a href="#">Politica de Confidențialitate</a></li>
                <li><a href="#">Politica de Cookie-uri</a></li>
                <li><a href="#">Politica de Retur</a></li>
              </ul>
            </div>

            {/* Coloana 3: Asistență */}
            <div className={styles.footerCol}>
              <h4 className={styles.colTitle}>Asistență Clienți</h4>
              <ul className={styles.linkList}>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Întrebări Frecvente (FAQ)</a></li>
                <li><a href="#">Cum Cumpăr?</a></li>
                <li><a href="#">Livrare și Plată</a></li>
                <li><a href="#">Urmărire Comandă</a></li>
              </ul>
            </div>

            {/* Coloana 4: Contact & Newsletter */}
            <div className={styles.footerCol}>
              <h4 className={styles.colTitle}>Contact</h4>
              <ul className={styles.contactInfo}>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>+40 700 000 000</span>
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span>contact@longevityfarma.ro</span>
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span>Luni - Vineri: 09:00 - 17:00</span>
                </li>
              </ul>
              
              <div className={styles.newsletter}>
                <h4>Abonează-te la Newsletter</h4>
                <NewsletterForm />
              </div>
            </div>

          </div>
        </div>

        {/* Partea de Jos - ANPC & Copyright */}
        <div className={styles.footerBottom}>
          <div className={styles.romaniaCompliance}>
            <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer" className={styles.anpcBadge}>
              <div className={styles.anpcText}>
                <strong>ANPC - SAL</strong>
                <span>Soluționarea Alternativă a Litigiilor</span>
              </div>
            </a>
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className={styles.anpcBadge}>
              <div className={styles.anpcText}>
                <strong>ANPC - SOL</strong>
                <span>Soluționarea Online a Litigiilor</span>
              </div>
            </a>
          </div>
          
          <div className={styles.copyright}>
            <p>&copy; {new Date().getFullYear()} Longevity Farma. Toate drepturile rezervate.</p>
            <div className={styles.paymentMethods}>
              {/* Dummy icons for payment */}
              <div className={styles.payIcon}>VISA</div>
              <div className={styles.payIcon}>MasterCard</div>
              <div className={styles.payIcon}>Apple Pay</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
