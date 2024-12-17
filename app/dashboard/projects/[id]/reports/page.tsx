import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import styles from './reports.module.css';
import DateTime from '@/components/datetime';
import ReportsTable from './reportsTable';

export default async function URLsPage({ params }: { params: Promise<{ id: string }> }) {
  const projectID = (await params).id;

  const supabase = await createClient();

  const { data: reportFrequency } = await supabase
    .from('projects')
    .select('report_frequency')
    .eq('id', projectID)
    .single();

  const { data: batches } = await supabase
    .from('batches')
    .select()
    .eq('project_id', projectID)
    .order('created_at', { ascending: false });

  const lastBatch = batches && batches.length > 0 ? new Date(batches[0].created_at) : new Date();
  const nextBatch = new Date(lastBatch);

  switch (reportFrequency?.report_frequency) {
    case 'daily':
      nextBatch.setDate(nextBatch.getDate() + 1);
      break;
    case 'weekly':
      while (nextBatch.getDay() !== 1) {
        nextBatch.setDate(nextBatch.getDate() + 1);
      }
      break;
    case 'monthly':
      nextBatch.setMonth(nextBatch.getMonth() + 1);
      nextBatch.setDate(1);
      break;

    default:
      break;
  }

  if (!batches || batches.length === 0) {
    return (
      <>
        <h1>Reports</h1>
        <p>
          After you add some URLs, your reports will show up here on <DateTime date={nextBatch} />.
        </p>
        <Link href={`/dashboard/projects/${projectID}/urls/add`}>Add URLs</Link>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-location">
          <h1>Reports</h1>
        </div>
        <Link
          href={`/dashboard/projects/${projectID}/reports/manual`}
          type="submit"
          className="icon-action page-header-action"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
              clipRule="evenodd"
            />
          </svg>
          Run report
        </Link>
      </div>
      <p>
        Last updated on <DateTime date={lastBatch} />
      </p>
      <p className={styles.nextRun}>
        Next report on <DateTime date={nextBatch} />
      </p>
      <ReportsTable projectID={projectID} batches={batches} />
    </>
  );
}
