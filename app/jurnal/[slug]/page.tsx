import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getJournalArticleBySlug } from '../actions';
import styles from './Article.module.css';
import ProductSection from '@/components/ProductSection';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getJournalArticleBySlug(params.slug);
  if (!article) return { title: 'Articol inexistent' };

  return {
    title: `${article.title} | Longevity Farma`,
    description: article.summary,
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getJournalArticleBySlug(params.slug);
  
  if (!article) {
    notFound();
  }

  // Format paragraphs from plain text content
  const paragraphs = article.content.split('\n\n').filter(p => p.trim() !== '');

  return (
    <div className={styles.pageWrapper}>
      <article className={styles.articleContainer}>
        
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/">Acasă</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <Link href="/jurnal">Jurnal Științific</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>{article.title}</span>
        </div>

        {/* Header */}
        <header className={styles.articleHeader}>
          <div className={styles.tagsContainer}>
            {article.tags?.map((tag, idx) => (
              <span key={idx} className={styles.tag}>{tag}</span>
            ))}
          </div>
          <h1 className={styles.title}>{article.title}</h1>
          <p className={styles.summary}>{article.summary}</p>
          
          <div className={styles.metaInfo}>
            <div className={styles.authorBlock}>
              <span className={styles.authorName}>{article.author}</span>
            </div>
            <span className={styles.dot}>•</span>
            <time className={styles.date}>{formatDate(article.published_at)}</time>
          </div>
        </header>

        {/* Cover Image */}
        <div className={styles.coverImageWrapper}>
          <Image 
            src={article.image_url} 
            alt={article.title} 
            fill 
            className={styles.coverImage}
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
        </div>

        {/* Content */}
        <div className={styles.articleContent}>
          {paragraphs.map((text, idx) => {
            // Un mic hack pentru a randa bold text (ex: **Text**) doar daca avem
            const parts = text.split(/(\*\*.*?\*\*)/g);
            return (
              <p key={idx}>
                {parts.map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                  }
                  return part;
                })}
              </p>
            );
          })}
        </div>

        {/* Share / Back */}
        <div className={styles.articleFooter}>
          <Link href="/jurnal" className={styles.backBtn}>
            &larr; Înapoi la Jurnal
          </Link>
        </div>
      </article>

      {/* Recomandari produse */}
      <div className={styles.recommendedSection}>
        <ProductSection title="Produse recomandate pentru tine" filter="Bestseller" />
      </div>
    </div>
  );
}
