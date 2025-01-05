import { redirect } from 'next/navigation';
import { SWDMV4_PERCENTILES, SWDMV4_RATINGS } from './constants';
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

export const cleanValue = (value: string | undefined): string | undefined => {
  return value !== undefined ? value.trim() : undefined;
};

export const getValidationErrors = (password: string): string | null => {
  if (password.toLowerCase() === password || password.toUpperCase() === password) {
    return 'Passwords must contain both upper and lower case letters';
  }

  if (password.search(/[0-9]/) < 0 || password.search(/[A-Za-z]/) < 0) {
    return 'Passwords must contain a mix of numbers and letters';
  }

  if (password.search(/[[!@#$%^&*(),.?&quot;:{}|&lt;&gt;]/) < 0) {
    return 'Passwords must contain a special characters';
  }

  return null;
};

export function getRating(co2: number) {
  for (const percentile in SWDMV4_RATINGS) {
    const p = SWDMV4_PERCENTILES[percentile as keyof typeof SWDMV4_PERCENTILES];
    if (p - co2 > 0) {
      return SWDMV4_RATINGS[percentile as keyof typeof SWDMV4_RATINGS];
    }
  }
}
