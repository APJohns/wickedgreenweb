import Link from 'next/link';
import styles from './urls.module.css';
import Breadcrumbs from '@/components/breadcrumbs';
import { formatBytes, formatCO2, getProjectName, getURLReports } from '@/utils/utils';

export default async function URLsPage({ params }: { params: Promise<{ id: string }> }) {
  const projectID = (await params).id;
  const projectName = await getProjectName(projectID);

  const data = await getURLReports(projectID);

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
            <th className={styles.th}>Page weight</th>
            <th className={styles.th}>
              CO<sub>2</sub>
            </th>
            <th className={styles.th}>Rating</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((url) => (
            <tr key={url.id}>
              <td className={styles.td}>{new URL(url.url).pathname}</td>
              <td className={styles.td}>
                {formatBytes(url.reports[0].bytes).value}&thinsp;{formatBytes(url.reports[0].bytes).unit}
              </td>
              <td className={styles.td}>{formatCO2(url.reports[0].co2)}&thinsp;g</td>
              <td className={styles.td}>{url.reports[0].rating}</td>
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
