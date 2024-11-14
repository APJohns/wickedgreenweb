'use server';

import { encodedRedirect } from '@/utils/utils';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

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
  const projectID = formData.get('project_id') as string;
  if (!projectID) {
    return encodedRedirect('error', `/dashboard/projects/${projectID}/urls/add`, 'Invalid project id');
  }
  if (rawUrl) {
    let url = '';
    try {
      url = new URL(rawUrl).href;
    } catch (e) {
      console.error(e);
      return encodedRedirect('error', `/dashboard/projects/${projectID}/urls/add`, 'Invalid URL');
    }

    const supabase = await createClient();

    const { data, error: urlError } = await supabase.from('urls').select('url');
    if (urlError) {
      console.error(urlError);
    }
    if (data && Array.from(data, (d) => d.url).includes(url)) {
      return encodedRedirect(
        'error',
        `/dashboard/projects/${projectID}/urls/add`,
        'URL already exists in one of your projects'
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const getGreenCheck = async (): Promise<any> => {
        // Check if host is green
        console.log('Getting host information from greencheck API');
        const res = await fetch(
          `https://api.thegreenwebfoundation.org/greencheck/${new URL(url).host.replace('www.', '')}`
        );
        return await res.json();
      };

      const green_hosting_factor = (await getGreenCheck()).green ? 1 : 0;

      const { error } = await supabase
        .from('urls')
        .insert({ url, green_hosting_factor, user_id: user.id, project_id: projectID });

      if (error) {
        console.error(error);
      }
    }
  }
  return encodedRedirect('success', `/dashboard/projects/${projectID}`, 'URL successfully added');
};
