import type { Metadata } from 'next';
import { Figtree, Space_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import { createClient } from '@/utils/supabase/server';
import NavPrimary from '@/components/navPrimary';

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
          <NavPrimary isLoggedIn={!!user} />
        </header>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
