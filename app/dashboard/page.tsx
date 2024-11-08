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
      <Link href="/dashboard/urls">See URLs</Link>
      <FormMessage message={searchParams} />
    </main>
  );
}
