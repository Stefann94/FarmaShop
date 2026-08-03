import { createClient } from '../lib/supabase/server';
import HeaderClient from './HeaderClient';

export default async function Header() {
  const supabase = await createClient();

  // Fetch data in parallel
  const [
    { data: categories },
    { data: featuredProducts },
    { data: promos }
  ] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order'),
    supabase.from('products').select('*').eq('is_featured', true).limit(4),
    supabase.from('promos').select('*').eq('is_active', true).limit(1)
  ]);

  return (
    <HeaderClient 
      categories={categories || []} 
      featuredProducts={featuredProducts || []} 
      activePromo={promos?.[0] || null} 
    />
  );
}
