'use server';

import { Tables } from '@/database.types';
import { PLANS } from '@/utils/constants';
import { createClient, getPlan } from '@/utils/supabase/server';
import { encodedRedirect } from '@/utils/utils';
import { JSDOM } from 'jsdom';
import { cache } from 'react';

export const getURLCount = async () => {
  const supabase = await createClient();
  const { count, error } = await supabase.from('urls').select('*', { count: 'exact', head: true });
  if (error) {
    console.error(error);
  }
  return count;
};

export const getURLs = cache(async (projectID: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('urls')
    .select(
      `
      id,
      url,
      green_hosting_factor,
      projects!inner(id),
      reports(count)
    `
    )
    .eq('projects.id', projectID)
    .order('url', { ascending: true });
  if (error) {
    console.error(error);
  }
  return data;
});

export const getGreenCheck = async (url: string): Promise<{ inputURL: string; green: boolean }> => {
  // Check if host is green
  console.log('Getting host information from greencheck API');
  const res = await fetch(`https://api.thegreenwebfoundation.org/greencheck/${new URL(url).host.replace('www.', '')}`);
  const data = await res.json();
  return {
    inputURL: url,
    ...data,
  };
};

export const addURLAction = async (formData: FormData) => {
  const rawUrl = formData.get('url')?.toString().trim();
  const sitemap = formData.get('sitemap')?.toString().trim();
  const projectID = formData.get('project_id')?.toString().trim();

  if (!projectID) {
    return encodedRedirect('error', `/dashboard/projects/${projectID}/urls/add`, 'Invalid project id');
  }

  if (!sitemap && !rawUrl) {
    return encodedRedirect('error', `/dashboard/projects/${projectID}/urls/add`, 'No URLs defined');
  }

  const supabase = await createClient();
  const { data: dbURLs, error: urlError } = await supabase.from('urls').select('url');
  if (urlError) {
    console.error(urlError);
  }
  const existingURLs = dbURLs ? Array.from(dbURLs, (d) => d.url) : [];
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const plan = await getPlan(user?.id as string);

  const validateURL = (unvalidatedURL: string, quiet = false) => {
    let url = '';
    try {
      url = new URL(unvalidatedURL).href;
    } catch (e) {
      console.error(e);
      if (!quiet) {
        return encodedRedirect('error', `/dashboard/projects/${projectID}/urls/add`, 'Invalid URL');
      } else {
        return null;
      }
    }

    if (existingURLs.includes(url)) {
      if (!quiet) {
        return encodedRedirect(
          'error',
          `/dashboard/projects/${projectID}/urls/add`,
          'URL already exists in one of your projects'
        );
      } else {
        return null;
      }
    }
    return url;
  };

  if (rawUrl) {
    const url = validateURL(rawUrl);
    if (url) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (existingURLs.length >= PLANS[plan.toUpperCase() as keyof typeof PLANS].URLS) {
        return encodedRedirect(
          'error',
          `/dashboard/projects/${projectID}/urls/add`,
          'Error: URL limit already reached'
        );
      }

      if (user) {
        const green_hosting_factor = (await getGreenCheck(url)).green ? 1 : 0;

        const { error } = await supabase
          .from('urls')
          .insert({ url, green_hosting_factor, user_id: user.id, project_id: projectID });

        if (error) {
          console.error(error);
        }
        return encodedRedirect('success', `/dashboard/projects/${projectID}/urls`, 'URL successfully added');
      }
    }
  }

  if (sitemap) {
    let dom: JSDOM;
    let sitemapURLs: string[];
    try {
      dom = new JSDOM(sitemap, { contentType: 'application/xml' });
      sitemapURLs = Array.from(
        dom.window.document.querySelectorAll('url loc'),
        (loc: Element) => loc.textContent || ''
      );
    } catch (e) {
      console.error(e);
      return encodedRedirect('error', `/dashboard/projects/${projectID}/urls/add`, 'Error parsing sitemap');
    }

    if (sitemapURLs.length === 0) {
      return encodedRedirect('error', `/dashboard/projects/${projectID}/urls/add`, 'No URLs in sitemap');
    }

    if (existingURLs.length + sitemapURLs.length > PLANS[plan.toUpperCase() as keyof typeof PLANS].URLS) {
      return encodedRedirect('error', `/dashboard/projects/${projectID}/urls/add`, 'Too many URLs in sitemap');
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const urls: Omit<Tables<'urls'>, 'id' | 'created_at'>[] = [];
      const greenChecks = sitemapURLs
        .map((sitemapURL) => {
          const url = validateURL(sitemapURL, true);
          if (url) {
            const greenCheck = getGreenCheck(url);
            greenCheck.then(
              (value) => {
                urls.push({
                  url,
                  green_hosting_factor: value.green ? 1 : 0,
                  user_id: user.id,
                  project_id: projectID,
                });
              },
              (reason) => {
                console.error(reason);
              }
            );
            return greenCheck;
          } else {
            return null;
          }
        })
        .filter((d) => d !== null);

      await Promise.allSettled(greenChecks).then(async () => {
        const { error } = await supabase.from('urls').insert(urls);

        if (error) {
          console.error(error);
        }
        return encodedRedirect('success', `/dashboard/projects/${projectID}/urls`, 'URLs successfully added');
      });
    } else {
      return encodedRedirect('error', `/dashboard/projects/${projectID}/urls`, 'Failed to validate user');
    }
  }
};

export const deleteURLsAction = async (formData: FormData) => {
  const projectID = formData.get('projectID')?.toString().trim();
  const supabase = await createClient();
  formData.forEach(async (isOn, urlID) => {
    if (isOn === 'on') {
      const { error } = await supabase.from('urls').delete().eq('id', urlID);
      if (error) {
        console.error(error);
      }
    }
  });
  return encodedRedirect('success', `/dashboard/projects${projectID ? `/${projectID}/urls` : ''}`, `Deleted URL(s)`);
};

export interface URLsToUpdate {
  id: string;
  url: string;
}

export const updateGreenHosting = async (urls: URLsToUpdate[]) => {
  const supabase = await createClient();
  const recheckHosting = async (url: URLsToUpdate) => {
    const hosting = await getGreenCheck(url.url);
    const { data, error } = await supabase
      .from('urls')
      .update({
        green_hosting_factor: hosting.green ? 1 : 0,
      })
      .eq('id', url.id)
      .select('id, green_hosting_factor')
      .single();

    if (error) {
      console.error(error);
      return null;
    } else {
      return data;
    }
  };

  const checkHosting = urls.map((url) => {
    return recheckHosting(url);
  });

  return await Promise.all(checkHosting);
};
