'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import styles from './error.module.css';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={'page-padding page-padding-v ' + styles.main}>
      <h1>Error</h1>
      <p>{error.message}</p>
      <Link href="/">Try again?</Link>
    </main>
  );
}
