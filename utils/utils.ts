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
