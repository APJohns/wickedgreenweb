import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import ManageURLs from './manageURLs';

export default async function URLsPage({ params }: { params: Promise<{ id: string }> }) {
  const projectID = (await params).id;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('urls')
    .select(
      `
      id,
      url,
      green_hosting_factor,
      projects!inner(id),
      reports(count)
    `
    )
    .eq('projects.id', projectID)
    .order('url', { ascending: true });
  if (error) {
    console.error(error);
  }

  return (
    <>
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
      {data && data.length > 0 && <ManageURLs urls={data} />}
      {data?.length === 0 && (
        <>
          <p>Welcome! Let&apos;s add some URLs to this project.</p>
          <Link href={`/dashboard/projects/${projectID}/urls/add`}>Add URLs</Link>
        </>
      )}
    </>
  );
}
