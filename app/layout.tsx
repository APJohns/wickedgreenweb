import type { Metadata } from 'next';
import { Figtree, Space_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import Dropdown from '@/components/dropdown';
import { signOutAction } from '@/app/actions/auth';

const figtree = Figtree({ weight: ['400', '600', '700'], subsets: ['latin'], variable: '--font-family-body' });

const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-family-mono' });

export const metadata: Metadata = {
  title: 'Wicked Green Web',
  description: "Estimate your web page's sustainability.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className={`${figtree.className} ${figtree.variable} ${spaceMono.variable}`}>
        <header>
          <nav className="nav">
            <ul className="nav-list">
              <li>
                <Link href="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="nav-link">
                  How it works
                </Link>
              </li>
            </ul>
            {!user && process.env.VERSION === 'BETA' && (
              <Link href="/sign-in" className="nav-link">
                Sign in
              </Link>
            )}
            {user && (
              <Dropdown triggerText="Account">
                <li>
                  <Link href="/dashboard" className="dropdown-item">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="dropdown-item">
                    Account settings
                  </Link>
                </li>
                <li>
                  <Link href="https://forms.gle/uYqhTrC33fTRTXTY9" target="_blank" className="dropdown-item">
                    Give feedback
                  </Link>
                </li>
                <li>
                  <form action={signOutAction}>
                    <button type="submit" className="dropdown-item">
                      Sign out
                    </button>
                  </form>
                </li>
              </Dropdown>
            )}
          </nav>
        </header>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
