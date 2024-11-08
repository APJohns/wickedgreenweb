import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import styles from '../dashboard.module.css';

export default async function URLsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('urls').select();
  if (error) {
    console.error(error);
  }

  return (
    <main>
      <h1>URLs</h1>
      <Link href="/dashboard" className="icon-action">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to Dashboard
      </Link>
      <ul className={styles.urlList}>
        {data?.map((url) => (
          <li key={url.id}>{url.url}</li>
        ))}
      </ul>
      <Link href="/dashboard/urls/add" className={`icon-action ${styles.addUrl}`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add URL
      </Link>
    </main>
  );
}
