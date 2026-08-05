'use server';

import { createClient } from '@/lib/supabase/server';

export type JournalArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image_url: string;
  author: string;
  tags: string[];
  published_at: string;
};

// Fetch all articles
export async function getJournalArticles(): Promise<JournalArticle[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('journal_articles')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching journal articles:', error);
    return [];
  }

  return data as JournalArticle[];
}

// Fetch a single article by slug
export async function getJournalArticleBySlug(slug: string): Promise<JournalArticle | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('journal_articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Error fetching article with slug ${slug}:`, error);
    return null;
  }

  return data as JournalArticle;
}
