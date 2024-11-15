import Link from 'next/link';
import { FormMessage, Message } from '@/components/formMessage';
import { createClient } from '@/utils/supabase/server';
import { slugify } from '@/utils/utils';

export default async function DashboardPage(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  const supabase = await createClient();
  const { data, error } = await supabase.from('projects').select();
  if (error) {
    console.error(error);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <h2>Projects</h2>
      <ul>
        {data?.map((project) => (
          <li key={project.id}>
            <Link href={`/dashboard/projects/${slugify(project.id)}`}>{project.name}</Link>
          </li>
        ))}
      </ul>
      <Link href="/dashboard/projects/new">New project</Link>
      <FormMessage message={searchParams} />
    </main>
  );
}
