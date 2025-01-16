import { createClient, getPlan, getProjectName } from '@/utils/supabase/server';
import Delete from './delete';
import { notFound } from 'next/navigation';
import { FormMessage, Message } from '@/components/formMessage';
import { updateProjectAction } from '@/app/actions/projects';
import styles from './settings.module.css';
import Select from '@/components/select';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const projectID = (await params).id;
  const projectName = await getProjectName(projectID);

  return {
    title: `Settings - ${projectName} | Wicked Green Web`,
  };
}

export default async function SettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Message>;
}) {
  const projectID = (await params).id;
  const messageParams = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from('projects').select('id, report_frequency').eq('id', projectID).single();
  if (!data) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const plan = await getPlan(user?.id as string);

  return (
    <>
      <h1>Settings</h1>
      <FormMessage message={messageParams} />
      <form action={updateProjectAction} className={styles.updateProjectForm}>
        <Select label="Report frequency" name="reportFrequency" defaultValue={data.report_frequency} inline>
          <option value="daily" disabled={plan === 'free'}>
            Daily
          </option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </Select>
        {/* TODO: Change language to "Upgrade to Pro" when Pro is available */}
        {plan === 'free' && <p className="text-subtle">Daily reports unavailable on free tier</p>}
        <input type="hidden" name="projectID" value={projectID} />
        <button type="submit" className={`form-submit ${styles.saveChanges}`}>
          Save
        </button>
      </form>
      <div className={styles.dangerZone}>
        <h2>Danger zone</h2>
        <Delete projectID={projectID} />
      </div>
    </>
  );
}
