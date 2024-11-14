import type { Metadata } from 'next';
import { Anonymous_Pro } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { signOutAction } from './actions';
import Dropdown from '@/components/dropdown';

const anonPro = Anonymous_Pro({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-anon' });

export const metadata: Metadata = {
  title: 'GreenerWeb',
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
      <body className={`${anonPro.className} ${anonPro.variable}`}>
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
                    Account Settings
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
      </body>
    </html>
  );
}
