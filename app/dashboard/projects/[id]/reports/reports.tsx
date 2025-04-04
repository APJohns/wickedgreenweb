'use client';

import Link from 'next/link';
import styles from './reports.module.css';
import DateTime from '@/components/datetime';
import ReportsTable from './reportsTable';
import { Tables } from '@/database.types';

interface Props {
  projectID: string;
  batches: Tables<'batches'>[];
  nextBatch?: Date;
  lastBatch?: Date;
}

export default function Reports({ projectID, batches, nextBatch, lastBatch }: Props) {
  return (
    <>
      {!(!batches || batches.length === 0) && (
        <p>
          Last updated on <DateTime date={lastBatch} />
        </p>
      )}

      <p className={styles.nextRun}>
        Next report on <DateTime date={nextBatch} />
      </p>

      {!batches || batches.length === 0 ? (
        <>
          <p>
            After you add some URLs, your reports will show up here on <DateTime date={nextBatch} /> or when you run
            your next manual report.
          </p>
          <Link href={`/dashboard/projects/${projectID}/urls/add`}>Add URLs</Link>
        </>
      ) : (
        <ReportsTable projectID={projectID} batches={batches} />
      )}
    </>
  );
}
