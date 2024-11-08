import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import styles from './dashboard.module.css';
import { FormMessage, Message } from '@/components/formMessage';

export default async function DashboardPage(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.from('urls').select();
  if (error) {
    console.error(error);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <h2>URLs</h2>
      <ul className={styles.urlList}>
        {data?.map((url) => (
          <li>{url.url}</li>
        ))}
      </ul>
      <Link href="/dashboard/urls/add" className="icon-action">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add URL
      </Link>
      <FormMessage message={searchParams} />
    </main>
  );
}
