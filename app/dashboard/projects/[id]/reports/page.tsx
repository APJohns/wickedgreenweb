import { formatBytes, formatCO2, getProjectName } from '@/utils/utils';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import styles from './reports.module.css';
import DateTime from '@/components/date';

export default async function URLsPage({ params }: { params: Promise<{ id: string }> }) {
  const projectID = (await params).id;
  const projectName = await getProjectName(projectID);

  const supabase = await createClient();
  const { data: batches } = await supabase
    .from('batches')
    .select()
    .eq('project_id', projectID)
    .order('date', { ascending: false });

  if (!batches) {
    return (
      <>
        <h1>Reports</h1>
        <p>Welcome! Let&apos;s add some URLs to this project.</p>
        <Link href={`/dashboard/projects/${projectID}/urls/add`}>Add URLs</Link>
      </>
    );
  }

  const lastBatch = new Date(batches[0].created_at);
  const nextBatch = new Date(lastBatch);
  nextBatch.setDate(nextBatch.getDate() + 1);

  const { data } = await supabase
    .from('reports')
    .select('*, urls!inner(*)')
    .eq('batch_id', batches[0].id)
    .eq('urls.project_id', projectID);

  if (!data) {
    notFound();
  }

  data.sort((a, b) => (a.urls.url > b.urls.url ? 1 : -1));

  return (
    <>
      <h1>Reports</h1>
      <p>
        Last updated on <DateTime date={lastBatch} />
      </p>
      <p className={styles.nextRun}>
        Next report on <DateTime date={nextBatch} />
      </p>
      <select>
        {batches.map((batch) => (
          <option key={batch.id} value={batch.id}>
            <DateTime date={new Date(batch.created_at)} />
          </option>
        ))}
      </select>
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
                  <td>
                    <DateTime datetime={new Date(report.created_at)} options={{ timeZoneName: 'short' }} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
