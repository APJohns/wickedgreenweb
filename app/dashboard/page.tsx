import Link from 'next/link';
import { FormMessage, Message } from '@/components/formMessage';

export default async function DashboardPage(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <main>
      <h1>Dashboard</h1>
      <Link href="/dashboard/urls">See URLs</Link>
      <FormMessage message={searchParams} />
    </main>
  );
}
