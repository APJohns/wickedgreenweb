import { createClient } from '@/utils/supabase/server';
import Delete from './delete';
import { notFound } from 'next/navigation';
import { FormMessage, Message } from '@/components/formMessage';
import { updateProjectAction } from '@/app/actions';
import styles from './settings.module.css';

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
        <label className="form-control">
          <div className="form-control-label">Report frequency</div>
          <select name="reportFrequency" className="form-control-input" defaultValue={data.report_frequency}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
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
