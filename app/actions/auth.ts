'use server';

import { createClient } from '@/utils/supabase/server';
import { encodedRedirect, getValidationErrors } from '@/utils/utils';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const signUpAction = async (formData: FormData): Promise<void> => {
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString().trim();
  const confirmPassword = formData.get('confirm_password')?.toString().trim();
  const supabase = await createClient();
  const origin = (await headers()).get('origin');

  if (!email || !password) {
    return encodedRedirect('error', '/sign-up', 'Email and password are required');
  }

  const validationErrors = getValidationErrors(password);

  if (validationErrors) {
    return encodedRedirect('error', '/sign-up', validationErrors);
  }

  if (password !== confirmPassword) {
    return encodedRedirect('error', '/sign-up', "Passwords don't match");
  }

  const { data, error } = await supabase.auth.signUp({
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
    if (data.user) {
      return encodedRedirect(
        'success',
        '/sign-in',
        'Thanks for signing up! Please check your email for a verification link.'
      );
    } else {
      return encodedRedirect('error', '/sign-up', 'Failed to create user');
    }
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString().trim();
  const supabase = await createClient();

  if (!email || !password) {
    return encodedRedirect('error', '/sign-in', 'Invalid email or password');
  }

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
  const email = formData.get('email')?.toString().trim();
  const supabase = await createClient();
  const origin = (await headers()).get('origin');
  const callbackUrl = formData.get('callbackUrl')?.toString().trim();

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

  const password = formData.get('password')?.toString().trim();
  const confirmPassword = formData.get('confirmPassword')?.toString().trim();

  if (!password || !confirmPassword) {
    return encodedRedirect('error', '/account/reset-password', 'Password and confirm password are required');
  }

  const validationErrors = getValidationErrors(password);

  if (validationErrors) {
    return encodedRedirect('error', '/sign-up', validationErrors);
  }

  if (password !== confirmPassword) {
    return encodedRedirect('error', '/account/reset-password', 'Passwords do not match');
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect('error', '/account/reset-password', 'Password update failed');
  }

  return encodedRedirect('success', '/account/reset-password', 'Password updated');
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/sign-in');
};
