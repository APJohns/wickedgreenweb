'use server';

import { Database } from '@/database.types';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { cache } from 'react';

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            console.error(error);
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};

export const getProjects = cache(async (userID: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('projects').select().eq('user_id', userID).order('name');
  if (error) {
    console.error(error);
  }
  return data;
});

export const getProjectName = cache(async (id: string): Promise<string> => {
  const supabase = await createClient();

  const { data, error } = await supabase.from('projects').select().eq('id', id);
  if (error) {
    console.error(error);
  }
  if (!data) notFound();
  return data[0].name;
});

export const getURLReports = cache(async (projectID: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('urls')
    .select(
      `
      id,
      url,
      green_hosting_factor,
      reports(
        co2,
        rating,
        bytes,
        created_at
      )
    `
    )
    .eq(`project_id`, projectID)
    .order('created_at', { referencedTable: 'reports', ascending: false });
  if (error) {
    console.error(error);
  }
  return data;
});

export const getPlan = cache(async (userID?: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase.from('permissions').select().eq('user_id', user.id).single();
    if (error) {
      console.error(error);
    }
    if (!data) notFound();
    return data.plan;
  } else {
    return '';
  }
});
