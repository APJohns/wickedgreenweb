import Breadcrumbs from '@/components/breadcrumbs';
// import { createClient } from '@/utils/supabase/server';
import { getProjectName } from '@/utils/utils';
import Link from 'next/link';

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const projectID = (await params).id;
  const projectName = await getProjectName(projectID);

  /* const supabase = await createClient();
  const { data, error } = await supabase.from('urls').select().eq('project_id', projectID).limit(5);
  if (error) {
    console.error(error);
  } */

  const crumbs = [
    {
      text: 'Dashboard',
      href: '/dashboard',
    },
    {
      text: projectName,
    },
  ];

  return (
    <main>
      <h1>{projectName}</h1>
      <Breadcrumbs crumbs={crumbs} />
      {/* <div>
        <h2>Best and worst pages</h2>
        <ol>
          {data?.map((url) => (
            <li key={url.id}>{url.url}</li>
          ))}
        </ol>
      </div> */}
      <Link href={`/dashboard/projects/${projectID}/urls`}>See all URLs</Link>
    </main>
  );
}
