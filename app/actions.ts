'use server';

import { encodedRedirect } from '@/utils/utils';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { JSDOM } from 'jsdom';
import { Tables } from '@/database.types';

export const signUpAction = async (formData: FormData): Promise<void> => {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get('origin');

  if (!email || !password) {
    return encodedRedirect('error', '/sign-up', 'Email and password are required');
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + ' ' + error.message);
    return encodedRedirect('error', '/sign-up', error.message);
  } else {
    return encodedRedirect(
      'success',
      '/sign-up',
      'Thanks for signing up! Please check your email for a verification link.'
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect('error', '/sign-in', error.message);
  }

  return redirect('/dashboard');
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get('origin');
  const callbackUrl = formData.get('callbackUrl')?.toString();

  if (!email) {
    return encodedRedirect('error', '/forgot-password', 'Email is required');
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/account/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect('error', '/forgot-password', 'Could not reset password');
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect('success', '/forgot-password', 'Check your email for a link to reset your password.');
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!password || !confirmPassword) {
    encodedRedirect('error', '/account/reset-password', 'Password and confirm password are required');
  }

  if (password !== confirmPassword) {
    encodedRedirect('error', '/account/reset-password', 'Passwords do not match');
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect('error', '/account/reset-password', 'Password update failed');
  }

  encodedRedirect('success', '/account/reset-password', 'Password updated');
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/sign-in');
};

export const addURLAction = async (formData: FormData) => {
  const rawUrl = formData.get('url') as string;
  const sitemap = formData.get('sitemap') as string;
  const projectID = formData.get('project_id') as string;

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

  const validateURL = (unvalidatedURL: string) => {
    let url = '';
    try {
      url = new URL(unvalidatedURL).href;
    } catch (e) {
      console.error(e);
      return encodedRedirect('error', `/dashboard/projects/${projectID}/urls/add`, 'Invalid URL');
    }

    if (existingURLs.includes(url)) {
      return encodedRedirect(
        'error',
        `/dashboard/projects/${projectID}/urls/add`,
        'URL already exists in one of your projects'
      );
    }
    return url;
  };

  const getGreenCheck = async (url: string): Promise<{ green: boolean }> => {
    // Check if host is green
    console.log('Getting host information from greencheck API');
    const res = await fetch(
      `https://api.thegreenwebfoundation.org/greencheck/${new URL(url).host.replace('www.', '')}`
    );
    return await res.json();
  };

  if (rawUrl) {
    const url = validateURL(rawUrl);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const green_hosting_factor = (await getGreenCheck(url)).green ? 1 : 0;

      const { error } = await supabase
        .from('urls')
        .insert({ url, green_hosting_factor, user_id: user.id, project_id: projectID });

      if (error) {
        console.error(error);
      }
      return encodedRedirect('success', `/dashboard/projects/${projectID}`, 'URL successfully added');
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
      console.log(sitemapURLs);
    } catch (e) {
      console.error(e);
      return encodedRedirect('error', `/dashboard/projects/${projectID}`, 'Error parsing sitemap');
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const urls: Omit<Tables<'urls'>, 'id' | 'created_at'>[] = [];
      const greenChecks = sitemapURLs.map((sitemapURL) => {
        const url = validateURL(sitemapURL);
        const greenCheck = getGreenCheck(url);
        greenCheck.then(
          (value) => {
            console.log(value);
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
      });

      Promise.allSettled(greenChecks).then(async () => {
        const { error } = await supabase.from('urls').insert(urls);

        if (error) {
          console.error(error);
        }
        return encodedRedirect('success', `/dashboard/projects/${projectID}`, 'URLs successfully added');
      });
    }
    return encodedRedirect('error', `/dashboard/projects/${projectID}`, 'Failed to validate user');
  }
};

export const createProjectAction = async (formData: FormData) => {
  const name = formData.get('name') as string;
  if (!name || name === 'new') {
    return encodedRedirect('error', `/dashboard/projects/new`, 'Invalid project name');
  }

  const supabase = await createClient();

  const { data, error: urlError } = await supabase.from('projects').select('name');
  if (urlError) {
    console.error(urlError);
  }
  data?.forEach((d) => {
    if (name.toLowerCase() === d.name.toLowerCase()) {
      return encodedRedirect('error', `/dashboard/projects/new`, 'Project with the same name already exists');
    }
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { error } = await supabase.from('projects').insert({ name, user_id: user.id });

    if (error) {
      console.error(error);
    }
  }

  return encodedRedirect('success', `/dashboard`, 'Project successfully created');
};

export const deleteProjectAction = async (formData: FormData) => {
  const projectID = formData.get('projectID') as string;
  if (projectID) {
    const supabase = await createClient();
    const { error } = await supabase.from('projects').delete().eq('id', projectID);
    if (error) {
      return encodedRedirect('error', `/dashboard`, 'Something went wrong deleting your project');
    }
    return encodedRedirect('success', `/dashboard`, 'Project deleted');
  } else {
    return encodedRedirect('error', `/dashboard`, 'Invalid project ID');
  }
};

export const deleteURLsAction = async (formData: FormData) => {
  const supabase = await createClient();
  formData.forEach(async (isOn, urlID) => {
    if (isOn === 'on') {
      const { error } = await supabase.from('urls').delete().eq('id', urlID);
      if (error) {
        console.error(error);
      }
    }
  });
  return encodedRedirect('success', `/dashboard`, `Deleted URL(s)`);
};
