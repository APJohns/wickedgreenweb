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
      <div className="page-header">
        <div className="page-header-location">
          <h1>URLs</h1>
          <Breadcrumbs crumbs={crumbs} />
        </div>
        <Link href={`/dashboard/projects/${projectID}/urls/add`} className="icon-action page-header-action">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add URL
        </Link>
      </div>
      <div className="table-responsive">
        <table className={styles.urlTable}>
          <caption className="visually-hidden">
            A list of all URLs in project {projectName} and their most recent report results
          </caption>
          <thead>
            <tr>
              <th className={styles.th}>URL</th>
              <th className={styles.th}>Hosting</th>
              <th className={styles.th}>Page weight</th>
              <th className={styles.th}>
                CO<sub>2</sub>
              </th>
              <th className={styles.th}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((url) => {
              const latest = url.reports[url.reports.length - 1];
              return (
                <tr key={url.id}>
                  <td className={styles.td}>{new URL(url.url).pathname}</td>
                  <td className={styles.td}>{url.green_hosting_factor === 1 ? 'Green' : 'Dirty'}</td>
                  {latest ? (
                    <>
                      <td className={styles.td}>
                        {formatBytes(latest.bytes).value}&thinsp;{formatBytes(latest.bytes).unit}
                      </td>
                      <td className={styles.td}>{formatCO2(latest.co2)}&thinsp;g</td>
                      <td className={styles.td}>{latest.rating}</td>
                    </>
                  ) : (
                    <>
                      <td className={styles.td}></td>
                      <td className={styles.td}></td>
                      <td className={styles.td}></td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
