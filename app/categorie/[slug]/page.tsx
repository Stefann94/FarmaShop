import { createClient } from "../../../lib/supabase/server";
import { notFound } from "next/navigation";
import CategoryClient from "./CategoryClient";

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient();
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // 1. Fetch current category
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', decodedSlug)
    .single();

  if (!category) {
    notFound();
  }

  // 2. Fetch products for this category
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category_slug', decodedSlug)
    .order('created_at', { ascending: false });

  // 3. Fetch all categories (for subcategory chips navigation)
  const { data: allCategories } = await supabase
    .from('categories')
    .select('id, name, slug, image_url')
    .order('sort_order');

  return (
    <CategoryClient
      category={category}
      products={products || []}
      allCategories={allCategories || []}
    />
  );
}
