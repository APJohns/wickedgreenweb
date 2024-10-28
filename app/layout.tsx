import type { Metadata } from 'next';
import { Anonymous_Pro } from 'next/font/google';
import './globals.css';

const anonPro = Anonymous_Pro({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-anon' });

export const metadata: Metadata = {
  title: 'GreenerWeb',
  description: "Estimate your web page's sustainability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${anonPro.className} ${anonPro.variable}`}>{children}</body>
    </html>
  );
}
