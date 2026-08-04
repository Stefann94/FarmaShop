"use client";

import React, { useState, Fragment } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

type Category = { id: string; name: string; slug: string; sort_order: number; group_name?: string };
type Product = { id: string; name: string; slug: string; image_url: string; price: number };
type Promo = { id: string; title: string; description: string; image_url: string; tag: string };

interface HeaderClientProps {
  categories: Category[];
  featuredProducts: Product[];
  activePromo: Promo | null;
}

export default function HeaderClient({ categories, featuredProducts, activePromo }: HeaderClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Group categories by their group_name
  const groupedCategories = categories?.reduce((acc, cat) => {
    const group = cat.group_name || 'Alte Categorii';
    if (!acc[group]) acc[group] = [];
    acc[group].push(cat);
    return acc;
  }, {} as Record<string, Category[]>) || {};

  return (
    <>
      <div className={styles.headerWrapper}>
        {/* TOP BAR - Infinite marquee */}
        <div className={styles.topBar}>
          <div className={styles.tickerContent}>
            <div className={styles.tickerGroup}>
              <span className={styles.tickerItem}>Livrare gratuită la comenzi peste <strong>200 RON</strong></span>
              <span className={styles.tickerItem}>•</span>
              <span className={styles.tickerItem}>Folosește codul <strong>LONGEVITY15</strong> pentru 15% reducere</span>
              <span className={styles.tickerItem}>•</span>
              <span className={styles.tickerItem}>🌿 <strong>Pachete Imunitate</strong> cu -20% reducere doar săptămâna aceasta</span>
              <span className={styles.tickerItem}>•</span>
              <span className={styles.tickerItem}>Abonează-te la newsletter și primești <strong>10% OFF</strong></span>
              <span className={styles.tickerItem}>•</span>
              <span className={styles.tickerItem}>Livrare gratuită la comenzi peste <strong>200 RON</strong></span>
              <span className={styles.tickerItem}>•</span>
              <span className={styles.tickerItem}>Folosește codul <strong>LONGEVITY15</strong> pentru 15% reducere</span>
              <span className={styles.tickerItem}>•</span>
              <span className={styles.tickerItem}>🌿 <strong>Pachete Imunitate</strong> cu -20% reducere doar săptămâna aceasta</span>
              <span className={styles.tickerItem}>•</span>
              <span className={styles.tickerItem}>Abonează-te la newsletter și primești <strong>10% OFF</strong></span>
              <span className={styles.tickerItem}>•</span>
            </div>
            <div className={styles.tickerGroup} aria-hidden="true">
              <span className={styles.tickerItem}>Livrare gratuită la comenzi peste <strong>200 RON</strong></span>
              <span className={styles.tickerItem}>•</span>
              <span className={styles.tickerItem}>Folosește codul <strong>LONGEVITY15</strong> pentru 15% reducere</span>
              <span className={styles.tickerItem}>•</span>
              <span className={styles.tickerItem}>🌿 <strong>Pachete Imunitate</strong> cu -20% reducere doar săptămâna aceasta</span>
              <span className={styles.tickerItem}>•</span>
              <span className={styles.tickerItem}>Abonează-te la newsletter și primești <strong>10% OFF</strong></span>
              <span className={styles.tickerItem}>•</span>
              <span className={styles.tickerItem}>Livrare gratuită la comenzi peste <strong>200 RON</strong></span>
              <span className={styles.tickerItem}>•</span>
              <span className={styles.tickerItem}>Folosește codul <strong>LONGEVITY15</strong> pentru 15% reducere</span>
              <span className={styles.tickerItem}>•</span>
              <span className={styles.tickerItem}>🌿 <strong>Pachete Imunitate</strong> cu -20% reducere doar săptămâna aceasta</span>
              <span className={styles.tickerItem}>•</span>
              <span className={styles.tickerItem}>Abonează-te la newsletter și primești <strong>10% OFF</strong></span>
              <span className={styles.tickerItem}>•</span>
            </div>
          </div>
        </div>

        {/* HEADER */}
        <header className={styles.header}>
          <div className="container">
            <div className={styles.topRow}>
              {/* Left side */}
              <div className={styles.leftActions}>
                <button 
                  className={`${styles.iconBtn} ${isMenuOpen ? styles.iconBtnActive : ''}`} 
                  aria-label="Meniu Categorii"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                  )}
                </button>
                <button className={styles.iconBtn} aria-label="Căutare">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>
              </div>

              {/* Center Logo */}
              <div className={styles.logoCenter}>
                <a href="#" className={styles.logo}>
                  <svg className={styles.logoIcon} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 1 8.3C19.24 16.46 13.84 20 11 20Z"/>
                    <path d="M11 20c2-5 0-11-2-11"/>
                  </svg>
                  <div className={styles.logoTextWrapper}>
                    <div className={styles.logoText}>
                      Longevity<span className={styles.logoTextLight}>Farma</span>
                    </div>
                    <span className={styles.premiumText}>Premium Quality</span>
                  </div>
                </a>
              </div>

              {/* Right side */}
              <div className={styles.rightActions}>
                <button className={styles.iconBtn} aria-label="Favorite">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
                <button className={styles.iconBtn} aria-label="Cont utilizator">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </button>
                <button className={styles.cartBtn} aria-label="Coș cumpărături">
                  <div className={styles.cartIconWrapper}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    <span className={styles.cartBadge}>2</span>
                  </div>
                  <span className={styles.cartTotal}>334 Lei</span>
                </button>
              </div>
            </div>
          </div>

          {/* OVERLAY BACKDROP */}
          {isMenuOpen && (
            <div className={styles.menuBackdrop} onClick={() => setIsMenuOpen(false)}></div>
          )}

          {/* DROPDOWN MENU - Overlays the bottomMenu and page content */}
          {isMenuOpen && (
            <div className={styles.dropdownMenu}>
              <div className="container">
                <div className={styles.dropdownContent}>
                  {Object.entries(groupedCategories).map(([groupName, cats]) => (
                    <div key={groupName} className={styles.dropdownColumn}>
                      <h3>{groupName}</h3>
                      <ul>
                        {cats.map((cat) => (
                          <li key={cat.id}><a href={`/categorie/${cat.slug}`}>{cat.name}</a></li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <div className={styles.dropdownColumn}>
                    <h3>Produse de Top</h3>
                    <ul>
                      {featuredProducts?.map((prod) => (
                        <li key={prod.id}><a href={`/produs/${prod.slug}`}>{prod.name}</a></li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.dropdownColumn}>
                    {activePromo && (
                      <div className={styles.dropdownPromo}>
                        <div className={styles.promoImage} style={activePromo.image_url ? { backgroundImage: `url(${activePromo.image_url})` } : {}}>
                          {activePromo.tag && <span className={styles.promoTag}>{activePromo.tag}</span>}
                        </div>
                        <h4>{activePromo.title}</h4>
                        <p>{activePromo.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="container">
            <nav className={styles.bottomMenu}>
              <a href="#bestsellers" className={styles.menuLink}>Bestsellers</a>
              <a href="#pachete" className={styles.menuLink}>Pachete & Oferte</a>
              <a href="#calitate" className={styles.menuLink}>Calitate & Ingrediente</a>
              <a href="#abonamente" className={styles.menuLink}>Abonamente</a>
              <a href="#jurnal" className={styles.menuLink}>Jurnal Științific</a>
              <a href="#despre-noi" className={styles.menuLink}>Despre Noi</a>
            </nav>
          </div>
        </header>
      </div>
    </>
  );
}
