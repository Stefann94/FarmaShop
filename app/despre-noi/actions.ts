'use server';

import { createClient } from '@/lib/supabase/server';

export type AboutUsSection = {
  id: string;
  section_key: string;
  title: string;
  description: string;
  label: string | null;
  image_url: string;
};

export async function getAboutUsContent(): Promise<AboutUsSection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('about_us_content')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching about us content:', error);
    return [];
  }

  return data as AboutUsSection[];
}
