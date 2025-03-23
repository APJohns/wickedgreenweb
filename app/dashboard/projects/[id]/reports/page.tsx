import { getProjectName } from '@/utils/supabase/server';
import { FormMessage, Message } from '@/components/formMessage';
import Reports from './reports';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const projectID = (await params).id;
  const projectName = await getProjectName(projectID);

  return {
    title: `Reports - ${projectName} | Wicked Green Web`,
  };
}

export default async function ReportsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Message>;
}) {
  const messageParams = await searchParams;

  return (
    <>
      <FormMessage message={messageParams} />
      <Reports params={params} />
    </>
  );
}
