'use client';

import Link from 'next/link';
import { getBatches } from '@/app/actions/batches';
import { getReportFrequency } from '@/app/actions/reports';
import { use, useEffect, useState } from 'react';
import { Tables } from '@/database.types';
import { FormMessage, Message } from '@/components/formMessage';
import Loader from '@/components/loader';
import Reports from './reports';

export default function ReportsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Message>;
}) {
  const messageParams = use(searchParams);

  const [projectID, setProjectID] = useState('');
  const [batches, setBatches] = useState<Tables<'batches'>[]>();
  const [nextBatch, setNextBatch] = useState<Date>();
  const [lastBatch, setLastBatch] = useState<Date>();

  useEffect(() => {
    const setup = async () => {
      setProjectID((await params).id);

      const reportFrequency = await getReportFrequency(projectID);
      const batches = await getBatches(projectID);
      setBatches(batches || undefined);

      const lastBatch = batches && batches.length > 0 ? new Date(batches[0].created_at) : new Date();
      const nextBatch = new Date(lastBatch);

      switch (reportFrequency?.report_frequency) {
        case 'daily':
          nextBatch.setUTCDate(nextBatch.getUTCDate() + 1);
          break;
        case 'weekly':
          while (nextBatch.getDay() !== 1) {
            nextBatch.setUTCDate(nextBatch.getUTCDate() + 1);
          }
          break;
        case 'monthly':
          nextBatch.setUTCMonth(nextBatch.getUTCMonth() + 1);
          nextBatch.setUTCDate(1);
          break;

        default:
          break;
      }

      setNextBatch(nextBatch);
      setLastBatch(lastBatch);
    };
    setup();
  }, [params, projectID]);

  return (
    <>
      <FormMessage message={messageParams} />
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

      {batches === undefined ? (
        <Loader />
      ) : (
        <Reports projectID={projectID} batches={batches} nextBatch={nextBatch} lastBatch={lastBatch} />
      )}
    </>
  );
}
