import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import styles from './urls.module.css';
import Breadcrumbs from '@/components/breadcrumbs';
import { getProjectName } from '@/utils/utils';

export default async function URLsPage({ params }: { params: Promise<{ id: string }> }) {
  const projectID = (await params).id;
  const projectName = await getProjectName(projectID);

  const supabase = await createClient();
  const { data, error } = await supabase.from('urls').select();
  if (error) {
    console.error(error);
  }

  const crumbs = [
    {
      text: 'Dashboard',
      href: '/dashboard',
    },
    {
      text: projectName,
      href: `/dashboard/projects/${projectID}`,
    },
    {
      text: 'URLs',
    },
  ];

  return (
    <>
      <h1>URLs</h1>
      <Breadcrumbs crumbs={crumbs} />
      <table className={styles.urlTable}>
        <caption className="visually-hidden">
          A list of all URLs in project {projectName} and their most recent report results
        </caption>
        <thead>
          <tr>
            <th className={styles.th}>URL</th>
            <th className={styles.th}>Latest emissions</th>
            <th className={styles.th}>Latest rating</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((url) => (
            <tr key={url.id}>
              <td className={styles.td}>{new URL(url.url).pathname}</td>
              <td className={styles.td}></td>
              <td className={styles.td}></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href={`/dashboard/projects/${projectID}/urls/add`} className={`icon-action ${styles.addUrl}`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add URL
      </Link>
    </>
  );
}
