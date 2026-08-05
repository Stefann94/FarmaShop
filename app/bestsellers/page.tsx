import { createClient } from "../../lib/supabase/server";
import BestsellersClient from "./BestsellersClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Bestsellers | Longevity Farma',
  description: 'Descoperă cele mai vândute suplimente premium din magazinul nostru. Produse testate și apreciate de mii de clienți.',
};

export default async function BestsellersPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('is_bestseller', true)
    .order('price', { ascending: false });

  return <BestsellersClient products={products || []} />;
}
