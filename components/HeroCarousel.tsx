"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import styles from './HeroCarousel.module.css';

const slides = [
  {
    id: 1,
    image: "/product-1-tr.png",
    label: "Bestseller",
    title: "Investește Astăzi în Ziua de Mâine",
    description: "Suplimente alimentare premium, formulate științific pentru longevitate celulară și vitalitate zilnică."
  },
  {
    id: 2,
    image: "/product-2-tr.png",
    label: "Nou",
    title: "Extracte Naturale, Puritate Maximă",
    description: "Nutrienți esențiali din plante organice cu biodisponibilitate maximă. Fără alergeni, fără compromisuri."
  },
  {
    id: 3,
    image: "/product-3-tr.png",
    label: "Calitate",
    title: "Știință și Inovație Pentru Longevitate",
    description: "Fiecare lot testat în laboratoare independente. Transparență totală, calitate garantată."
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Ref for actions container to match width for indicators
  const actionsRef = useRef<HTMLDivElement>(null);
  const [actionsWidth, setActionsWidth] = useState(420); // Fallback

  const updateIndicatorPosition = useCallback(() => {
    if (actionsRef.current) {
      setActionsWidth(actionsRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    updateIndicatorPosition();
    window.addEventListener('resize', updateIndicatorPosition);
    return () => window.removeEventListener('resize', updateIndicatorPosition);
  }, [updateIndicatorPosition]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  const slide = slides[currentSlide];

  return (
    <section
      className={styles.hero}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.heroContainer}>
        {/* Text Content */}
        <div className={styles.textBlock}>
          <div className={styles.textBlockInner}>
            <span className={styles.label} key={slide.id + '-l'}>{slide.label}</span>

            <h1 className={styles.title} key={slide.id + '-t'}>
              {slide.title}
            </h1>

            <p className={styles.description} key={slide.id + '-d'}>
              {slide.description}
            </p>

            <div className={styles.actions} ref={actionsRef}>
              <a href="#produse" className={styles.ctaPrimary}>
                Descoperă Produsele
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
              <a href="#calitate" className={styles.ctaOutline}>Calitate & Ingrediente</a>
            </div>
          </div>

          {/* Slide indicators perfectly centered matching actions width, pushed to bottom naturally */}
          <div className={styles.indicatorsWrapper} style={{ width: `${actionsWidth}px` }}>
            <div className={styles.indicators}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Image */}
        <div className={styles.imageBlock}>
          <div className={styles.imageInner}>
            {slides.map((s, index) => (
              <div
                key={s.id}
                className={`${styles.imageWrapper} ${index === currentSlide ? styles.imageActive : ''}`}
              >
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className={styles.image}
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Trust badges floating over the image */}
          <div className={styles.floatingBadges}>
            <div className={styles.badge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Formule curate
            </div>
            <div className={styles.badge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Fără alergeni
            </div>
            <div className={styles.badge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Validat științific
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
