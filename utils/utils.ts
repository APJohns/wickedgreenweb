import { notFound, redirect } from 'next/navigation';
import { cache } from 'react';
import { createClient } from './supabase/server';

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(type: 'error' | 'success', path: string, message: string) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export function slugify(text: string): string {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

interface FormattedBytes {
  value: number;
  unit: string;
}

export function formatBytes(bytes: number, decimals?: number): FormattedBytes {
  if (bytes == 0) {
    return {
      value: 0,
      unit: 'Bytes',
    };
  }
  const k = 1000,
    dm = decimals || 2,
    sizes = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return {
    value: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),
    unit: sizes[i],
  };
}

export function formatCO2(co2: number) {
  return co2 < 0.01 ? '<\u20090.01' : co2.toFixed(2);
}

export const getProjectName = cache(async (id: string): Promise<string> => {
  console.log('fetching name');
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
