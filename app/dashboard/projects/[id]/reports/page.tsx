import { formatBytes, formatCO2, getProjectName } from '@/utils/utils';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function URLsPage({ params }: { params: Promise<{ id: string }> }) {
  const projectID = (await params).id;
  const projectName = await getProjectName(projectID);

  const supabase = await createClient();
  const { data: latestReportDate } = await supabase
    .from('reports')
    .select('created_at')
    .eq('project_id', projectID)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!latestReportDate) {
    return (
      <>
        <h1>Reports</h1>
        <p>Welcome! Let&apos;s add some URLs to this project.</p>
        <Link href={`/dashboard/projects/${projectID}/urls/add`}>Add URLs</Link>
      </>
    );
  }

  const min = new Date(latestReportDate.created_at);
  min.setUTCHours(min.getUTCHours() - 1);

  const max = new Date(min);
  max.setDate(max.getDate() + 1);

  const { data } = await supabase
    .from('reports')
    .select('*, urls(*)')
    .eq('project_id', projectID)
    .gte('created_at', min.toISOString())
    .lt('created_at', max.toISOString());

  if (!data) {
    notFound();
  }

  return (
    <>
      <h1>Reports</h1>
      <dl>
        <dt>Last run:</dt>
        <dd>{min.toLocaleDateString()}</dd>
        <dt>Next run:</dt>
        <dd>{max.toLocaleDateString()}</dd>
      </dl>
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
