"use client";

import React, { useState, Fragment, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import styles from './Header.module.css';
import { logout } from '@/app/auth/actions';
import { useCart } from '@/app/context/CartContext';
import { useFavorites } from '@/app/context/FavoritesContext';
import { createBrowserClient } from '@supabase/ssr';

type Category = { id: string; name: string; slug: string; sort_order: number; group_name?: string };
type Product = { id: string; name: string; slug: string; image_url: string; price: number };
type Promo = { id: string; title: string; description: string; image_url: string; tag: string };

interface HeaderClientProps {
  categories: Category[];
  featuredProducts: Product[];
  activePromo: Promo | null;
  user: any;
}

export default function HeaderClient({ categories, featuredProducts, activePromo, user }: HeaderClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavOpen, setIsFavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();
  const pathname = usePathname();
  const { cartItems, cartCount, cartTotal, isLoading, clearCart, removeFromCart } = useCart();
  const { favoriteItems, favoriteCount, toggleFavorite, clearFavorites } = useFavorites();

  const favListRef = useRef<HTMLDivElement>(null);
  const cartListRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when popups open
  useEffect(() => {
    if (isFavOpen && favListRef.current) {
      favListRef.current.scrollTop = 0;
    }
  }, [isFavOpen]);

  useEffect(() => {
    if (isCartOpen && cartListRef.current) {
      cartListRef.current.scrollTop = 0;
    }
  }, [isCartOpen]);

  // Close all menus when navigating to a new page
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsCartOpen(false);
    setIsFavOpen(false);
    setIsSearchOpen(false);
    setSearchTerm('');
  }, [pathname]);

  // Debounced Live Search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      const { data, error } = await supabase.rpc('search_products', { search_term: searchTerm.trim() });
      if (!error && data) {
        setSearchResults(data);
      }
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, supabase]);

  // Group categories by their group_name
  const groupedCategories = categories?.reduce((acc, cat) => {
    const group = cat.group_name || 'Alte Categorii';
    if (!acc[group]) acc[group] = [];
    acc[group].push(cat);
    return acc;
  }, {} as Record<string, Category[]>) || {};

  const handleLogout = async () => {
    setIsProfileOpen(false);
    clearCart();
    clearFavorites();
    await logout();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearchOpen(false);
      router.push(`/produse?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

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
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                    setIsSearchOpen(false);
                    setIsProfileOpen(false);
                    setIsCartOpen(false);
                  }}
                >
                  {isMenuOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                  )}
                </button>
                <button 
                  className={`${styles.iconBtn} ${isSearchOpen ? styles.iconBtnActive : ''}`} 
                  aria-label="Căutare"
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                    setIsMenuOpen(false);
                    setIsProfileOpen(false);
                    setIsCartOpen(false);
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>
              </div>

              {/* Center Logo */}
              <div className={styles.logoCenter}>
                <Link href="/" className={styles.logo} onClick={(e) => {
                  if (window.location.pathname === '/') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}>
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
                </Link>
              </div>

              {/* Right side */}
              <div className={styles.rightActions}>
                <div className={styles.favWrapper} onMouseEnter={() => setIsFavOpen(true)} onMouseLeave={() => setIsFavOpen(false)}>
                  <button className={`${styles.iconBtn} ${isFavOpen ? styles.iconBtnActive : ''}`} aria-label="Favorite">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    {favoriteCount > 0 && (
                      <span className={styles.favBadge}>{favoriteCount}</span>
                    )}
                  </button>
                  
                  <div className={`${styles.favDropdown} ${isFavOpen ? styles.favDropdownOpen : ''}`}>
                    <div className={styles.favHeader}>Ultimele adăugate</div>
                    <div className={styles.favList} ref={favListRef}>
                      {favoriteItems.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Nu ai niciun produs favorit.</div>
                      ) : (
                        favoriteItems.map(item => (
                          <Link 
                            href={`/produs/${item.product_slug}`} 
                            key={item.id} 
                            className={styles.favItem}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                            onClick={() => setIsFavOpen(false)}
                          >
                            <div className={styles.favItemImage}>
                              <Image src={item.image_url || '/placeholder.png'} alt={item.name || ''} fill style={{ objectFit: 'cover' }} />
                            </div>
                            <div className={styles.favItemInfo}>
                              <div className={styles.favItemName}>{item.name}</div>
                              <div className={styles.favItemPrice}>{item.price} Lei</div>
                            </div>
                            <button aria-label="Șterge de la favorite" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(item.product_slug) }} style={{ alignSelf: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#999', zIndex: 2 }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                          </Link>
                        ))
                      )}
                    </div>
                    <div className={styles.favFooter}>
                      <Link href="/account/favorite" className={styles.btnViewAllFavs} onClick={() => { setIsFavOpen(false); window.scrollTo(0, 0); }}>
                        Vezi toate produsele favorite
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={styles.profileWrapper}>
                  <button 
                    className={`${styles.iconBtn} ${isProfileOpen ? styles.iconBtnActive : ''}`} 
                    aria-label="Cont utilizator"
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                      setIsCartOpen(false);
                      setIsMenuOpen(false);
                      setIsSearchOpen(false);
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </button>
                  
                  {isProfileOpen && (
                    <div className={styles.profileBackdrop} onClick={() => setIsProfileOpen(false)}></div>
                  )}

                  <div className={`${styles.profileDropdown} ${isProfileOpen ? styles.profileDropdownOpen : ''}`}>
                    {user ? (
                      <>
                        <div className={styles.profileDropdownHeader}>
                          <p>Salut, <strong>{user.user_metadata?.first_name || 'Utilizator'}</strong>!</p>
                        </div>
                        <div className={styles.profileDropdownActions}>
                          <Link href="/account" className={styles.btnLogin} onClick={() => setIsProfileOpen(false)}>Contul meu</Link>
                          <button onClick={handleLogout} className={styles.btnSignup}>Deconectare</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.profileDropdownHeader}>
                          <p>Deblochează oferte și beneficii exclusive!</p>
                        </div>
                        <div className={styles.profileDropdownActions}>
                          <Link href="/login" className={styles.btnLogin} onClick={() => setIsProfileOpen(false)}>Autentificare</Link>
                          <Link href="/signup" className={styles.btnSignup} onClick={() => setIsProfileOpen(false)}>Creare Cont</Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className={styles.profileWrapper}>
                  <button 
                    className={`${styles.cartBtn} ${isCartOpen ? styles.iconBtnActive : ''}`} 
                    aria-label="Coș cumpărături"
                    onClick={() => {
                      setIsCartOpen(!isCartOpen);
                      setIsProfileOpen(false);
                      setIsMenuOpen(false);
                      setIsSearchOpen(false);
                    }}
                  >
                    <div className={styles.cartIconWrapper}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                      {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
                    </div>
                    <span className={styles.cartTotal}>{cartTotal.toFixed(2)} Lei</span>
                  </button>

                  {isCartOpen && (
                    <div className={styles.profileBackdrop} onClick={() => setIsCartOpen(false)}></div>
                  )}

                  <div className={`${styles.favDropdown} ${isCartOpen ? styles.favDropdownOpen : ''}`}>
                    {!user ? (
                      <div className={styles.favHeader} style={{ padding: '20px' }}>
                        Trebuie să fii autentificat pentru a folosi coșul.
                        <div style={{ marginTop: '15px' }}>
                          <Link href="/login" className={styles.btnViewAllFavs} onClick={() => setIsCartOpen(false)}>Autentificare</Link>
                        </div>
                      </div>
                    ) : cartCount === 0 ? (
                      <div className={styles.favHeader} style={{ padding: '20px' }}>
                        Coșul tău este gol.
                        <div style={{ marginTop: '15px' }}>
                          <Link href="/" className={styles.btnViewAllFavs} onClick={() => setIsCartOpen(false)}>Înapoi la magazin</Link>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={styles.favHeader}>Produse în coș ({cartCount})</div>
                        <div className={styles.favList} ref={cartListRef}>
                          {cartItems.map(item => (
                            <Link 
                              href={`/produs/${item.product_slug}`} 
                              key={item.id} 
                              className={styles.favItem}
                              style={{ textDecoration: 'none', color: 'inherit' }}
                              onClick={() => setIsCartOpen(false)}
                            >
                              <div className={styles.favItemImage}>
                                <Image src={item.image_url || '/placeholder.png'} alt={item.name || ''} fill style={{ objectFit: 'cover' }} />
                              </div>
                              <div className={styles.favItemInfo}>
                                <div className={styles.favItemName}>{item.name}</div>
                                <div className={styles.favItemPrice}>{item.price} Lei <span style={{fontSize: '0.8rem', color: '#666', fontWeight: 500}}>x {item.quantity}</span></div>
                              </div>
                              <button aria-label="Șterge din coș" onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromCart(item.product_slug) }} style={{ alignSelf: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#999', zIndex: 2 }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                              </button>
                            </Link>
                          ))}
                        </div>
                        <div className={styles.favFooter}>
                          <div style={{ textAlign: 'center', marginBottom: '15px', fontSize: '1.05rem', color: '#222' }}>
                            Total: <strong>{cartTotal.toFixed(2)} Lei</strong>
                          </div>
                          <Link href="/cart" className={styles.btnViewAllFavs} onClick={() => setIsCartOpen(false)}>
                            Vezi coșul
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OVERLAY BACKDROP FOR MEGA MENU OR SEARCH */}
          {(isMenuOpen || isSearchOpen) && (
            <div className={styles.menuBackdrop} onClick={() => {setIsMenuOpen(false); setIsSearchOpen(false);}}></div>
          )}

          {/* SEARCH DROPDOWN */}
          {isSearchOpen && (
            <div className={styles.searchDropdown}>
              <div className="container">
                <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                  <div className={styles.searchInputWrapper}>
                    <svg className={styles.searchIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input 
                      type="text" 
                      className={styles.searchInput}
                      placeholder="Caută suplimente, vitamine, pachete..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                    />
                    <button type="submit" className={styles.searchSubmitBtn}>Căutare</button>
                  </div>
                </form>
                
                {!searchTerm.trim() ? (
                  <div className={styles.searchQuickLinks}>
                    <span>Descoperă rapid:</span>
                    <Link href="/categorie/longevitate" className={styles.quickLinkBtn} onClick={() => setIsSearchOpen(false)}>Anti-Aging</Link>
                    <Link href="/categorie/focus" className={styles.quickLinkBtn} onClick={() => setIsSearchOpen(false)}>Focus & Memorie</Link>
                    <Link href="/categorie/somn-stres" className={styles.quickLinkBtn} onClick={() => setIsSearchOpen(false)}>Somn & Stres</Link>
                    <Link href="/categorie/imunitate" className={styles.quickLinkBtn} onClick={() => setIsSearchOpen(false)}>Imunitate</Link>
                  </div>
                ) : (
                  <div className={styles.searchResults}>
                    {isSearching ? (
                      <div className={styles.searchEmpty}>Se caută...</div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((prod) => (
                        <Link 
                          href={`/produs/${prod.slug}`} 
                          key={prod.id} 
                          className={styles.searchResultItem}
                          onClick={() => setIsSearchOpen(false)}
                        >
                          <Image 
                            src={prod.image_url || '/placeholder.png'} 
                            alt={prod.name}
                            width={50}
                            height={50}
                            className={styles.searchResultImage}
                          />
                          <div className={styles.searchResultInfo}>
                            <span className={styles.searchResultName}>{prod.name}</span>
                            <span className={styles.searchResultPrice}>{prod.price} Lei</span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className={styles.searchEmpty}>Nu am găsit produse pentru "{searchTerm}"</div>
                    )}
                  </div>
                )}
              </div>
            </div>
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
                          <li key={cat.id}><Link href={`/categorie/${cat.slug}`}>{cat.name}</Link></li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <div className={styles.dropdownColumn}>
                    <h3>Produse de Top</h3>
                    <ul>
                      {featuredProducts?.map((prod) => (
                        <li key={prod.id}><Link href={`/produs/${prod.slug}`}>{prod.name}</Link></li>
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
              <Link href="/bestsellers" className={styles.menuLink}>Bestsellers</Link>
              <Link href="/pachete" className={styles.menuLink}>Pachete & Oferte</Link>
              <Link href="/abonamente" className={styles.menuLink}>Abonamente</Link>
              <Link href="/calitate" className={styles.menuLink}>Calitate & Ingrediente</Link>
              <Link href="/jurnal" className={styles.menuLink}>Jurnal Științific</Link>
              <Link href="#despre-noi" className={styles.menuLink}>Despre Noi</Link>
            </nav>
          </div>
        </header>
      </div>
    </>
  );
}
