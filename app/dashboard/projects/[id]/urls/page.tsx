'use client';

// import { getProjectName } from '@/utils/supabase/server';
import Link from 'next/link';
import ManageURLs from './manageURLs';
import { FormMessage, Message } from '@/components/formMessage';
import { use, useEffect, useState } from 'react';
import { getURLs } from '@/app/actions/urls';
import { Tables } from '@/database.types';
import Loader from '@/components/loader';

/* export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const projectID = (await params).id;
  const projectName = await getProjectName(projectID);

  return {
    title: `URLs - ${projectName} | Wicked Green Web`,
  };
} */

interface URLs extends Pick<Tables<'urls'>, 'id' | 'url' | 'green_hosting_factor'> {
  reports: {
    count: number;
  }[];
  projects: {
    id: string;
  };
}

export default function URLsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Message>;
}) {
  const projectID = use(params).id;
  const messageParams = use(searchParams);

  const [urls, setURLs] = useState<URLs[] | null>();

  useEffect(() => {
    if (projectID) {
      const setup = async () => {
        setURLs(await getURLs(projectID));
      };
      setup();
    }
  }, [projectID]);

  return (
    <>
      <FormMessage message={messageParams} />
      <div className="page-header">
        <div className="page-header-location">
          <h1>URLs</h1>
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
      {urls === undefined && <Loader />}
      {urls && urls.length > 0 && <ManageURLs urls={urls} projectID={projectID} />}
      {urls?.length === 0 && (
        <>
          <p>Welcome! Let&apos;s add some URLs to this project.</p>
          <Link href={`/dashboard/projects/${projectID}/urls/add`}>Add URLs</Link>
        </>
      )}
    </>
  );
}
