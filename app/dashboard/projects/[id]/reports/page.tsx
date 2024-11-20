import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import styles from './reports.module.css';
import DateTime from '@/components/datetime';
import ReportsTable from './reportsTable';

export default async function URLsPage({ params }: { params: Promise<{ id: string }> }) {
  const projectID = (await params).id;

  const supabase = await createClient();
  const { data: batches } = await supabase
    .from('batches')
    .select()
    .eq('project_id', projectID)
    .order('created_at', { ascending: false });

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

  return (
    <>
      <h1>Reports</h1>
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
