import Link from 'next/link';
import { FormMessage, Message } from '@/components/formMessage';
import { createClient, getProjects } from '@/utils/supabase/server';
import { slugify } from '@/utils/utils';
import styles from './dashboard.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Wicked Green Web',
};

export default async function DashboardPage(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const data = await getProjects(user?.id as string);

  return (
    <main>
      <div className="page-header">
        <div className="page-header-location">
          <h1>Projects</h1>
        </div>
        <Link href="/dashboard/projects/new" className="icon-action page-header-action">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New project
        </Link>
      </div>
      <ul className={styles.projectList}>
        {data?.map((project) => (
          <li key={project.id}>
            <Link href={`/dashboard/projects/${slugify(project.id)}`} className={styles.project}>
              {project.name}
            </Link>
          </li>
        ))}
      </ul>
      <FormMessage message={searchParams} />
    </main>
  );
}
