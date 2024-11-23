import { createClient } from '@/utils/supabase/server';
import Delete from './delete';
import { notFound } from 'next/navigation';
import { FormMessage, Message } from '@/components/formMessage';
import { updateProjectAction } from '@/app/actions';
import styles from './settings.module.css';
import Select from '@/components/select';

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

  return (
    <>
      <h1>Settings</h1>
      <FormMessage message={messageParams} />
      <form action={updateProjectAction} className={styles.updateProjectForm}>
        <Select label="Report frequency" name="reportFrequency" defaultValue={data.report_frequency} inline>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </Select>
        <input type="hidden" name="projectID" value={projectID} />
        <button type="submit" className="form-submit">
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
