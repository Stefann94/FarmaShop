import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://longevityfarma.ro'; // Replace with actual domain later

  // Static routes
  const routes = [
    '',
    '/jurnal',
    '/contact',
    '/abonamente',
    '/login',
    '/signup',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch categories
  const { data: categories } = await supabase.from('categories').select('slug');
  const categoryRoutes = (categories || []).map((cat) => ({
    url: `${baseUrl}/categorie/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Fetch products
  const { data: products } = await supabase.from('products').select('slug');
  const productRoutes = (products || []).map((prod) => ({
    url: `${baseUrl}/produs/${prod.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Fetch articles (jurnal)
  const { data: articles } = await supabase.from('articles').select('slug');
  const articleRoutes = (articles || []).map((article) => ({
    url: `${baseUrl}/jurnal/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...categoryRoutes, ...productRoutes, ...articleRoutes];
}
