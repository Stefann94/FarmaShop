import { createClient } from "../../lib/supabase/server";
import PacheteClient from "./PacheteClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Pachete & Oferte | Longevity Farma',
  description: 'Descoperă protocoalele și pachetele noastre premium de suplimente cu reducere garantată.',
};

export default async function PachetePage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_premium_bundle', true)
    .order('price', { ascending: false });

  return <PacheteClient products={products || []} />;
}
