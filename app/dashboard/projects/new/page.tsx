import { createProjectAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/formMessage';
import { createClient, getPlan } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import styles from './newProject.module.css';
import Select from '@/components/select';
import { PLANS } from '@/utils/constants';

export default async function NewProjectPage(props: {
  searchParams: Promise<Message>;
  params: Promise<{ id: string }>;
}) {
  const searchParams = await props.searchParams;
  const plan = await getPlan();

  const supabase = await createClient();
  const { count, error } = await supabase.from('projects').select('*', { count: 'exact', head: true });

  if (error) {
    console.error(error);
  }

  if (count === undefined || count === null) {
    notFound();
  }

  if (plan === 'free' && count >= PLANS.FREE.PROJECTS) {
    return (
      <main>
        <h1>New project</h1>
        {/* <p>
          <Link href="/pricing">Upgrade to Pro</Link> to add more projects.
        </p> */}
        <p>
          Features are limited as we roll out GreenerWeb. You may only have 1 project. We&apos;ll update you when this
          changes.
        </p>
      </main>
    );
  }

  return (
    <main>
      <h1>New project</h1>
      <form action={createProjectAction} className={styles.newProjectForm}>
        <label className={`form-control ${styles.name}`}>
          <div className="form-control-label">Name</div>
          <input type="text" name="name" className="form-control-input" />
        </label>
        <Select label="Report frequency" name="reportFrequency" defaultValue="weekly" inline>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </Select>
        <button type="submit" className="form-submit">
          Create project
        </button>
        <FormMessage message={searchParams} />
      </form>
    </main>
  );
}
