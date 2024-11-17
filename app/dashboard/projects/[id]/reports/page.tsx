import { formatBytes, formatCO2, getProjectName } from '@/utils/utils';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import styles from './reports.module.css';

export default async function URLsPage({ params }: { params: Promise<{ id: string }> }) {
  const projectID = (await params).id;
  const projectName = await getProjectName(projectID);

  const supabase = await createClient();
  const { data: dates } = await supabase
    .from('reports')
    .select('created_at, urls!inner(project_id)')
    .eq('urls.project_id', projectID)
    .order('created_at', { ascending: false });

  const reportDates: string[] = [];
  dates?.forEach((date) => {
    const day = new Date(new Date(date.created_at).toDateString()).toISOString();
    if (reportDates.at(-1) !== day) {
      reportDates.push(day);
    }
  });

  const latestReportDate = reportDates[0];

  if (!latestReportDate) {
    return (
      <>
        <h1>Reports</h1>
        <p>Welcome! Let&apos;s add some URLs to this project.</p>
        <Link href={`/dashboard/projects/${projectID}/urls/add`}>Add URLs</Link>
      </>
    );
  }

  const min = new Date(latestReportDate);
  min.setUTCHours(min.getUTCHours() - 1);

  const max = new Date(min);
  max.setDate(max.getDate() + 1);

  const { data } = await supabase
    .from('reports')
    .select('*, urls!inner(*)')
    .eq('urls.project_id', projectID)
    .gte('created_at', min.toISOString())
    .lt('created_at', max.toISOString());

  if (!data) {
    notFound();
  }

  const formateDateValue = (d: string): string => {
    return new Date(d).toISOString().split('T')[0];
  };

  return (
    <>
      <h1>Reports</h1>
      <p>Last updated on {min.toLocaleDateString()}</p>
      <p className={styles.nextRun}>Next report on {max.toLocaleDateString()}</p>
      <select>
        {reportDates.map((day) => (
          <option key={day} value={day}>
            {new Date(day).toLocaleDateString()}
          </option>
        ))}
      </select>
      {reportDates.length > 0 && (
        <input type="date" min={formateDateValue(reportDates.at(-1)!)} max={formateDateValue(reportDates[0])} />
      )}
      <div className="table-responsive">
        <table className="table">
          <caption className="visually-hidden">
            A list of all URLs in project {projectName} and their most recent report results
          </caption>
          <thead>
            <tr>
              <th>URL</th>
              <th>Hosting</th>
              <th>Page weight</th>
              <th>
                CO<sub>2</sub>
              </th>
              <th>Rating</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((report) => {
              return (
                <tr key={report.id}>
                  {report.urls && (
                    <>
                      <td>{new URL(report.urls.url).pathname}</td>
                      <td>{report.urls.green_hosting_factor === 1 ? 'Green' : 'Dirty'}</td>
                    </>
                  )}
                  <td>
                    {formatBytes(report.bytes).value}&thinsp;{formatBytes(report.bytes).unit}
                  </td>
                  <td>{formatCO2(report.co2)}&thinsp;g</td>
                  <td>{report.rating}</td>
                  <td>{new Date(report.created_at).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
