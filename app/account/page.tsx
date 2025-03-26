import { PLANS } from '@/utils/constants';
import { createClient, getPlan } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './account.module.css';

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const plan = await getPlan(user?.id as string);

  const { count: urlCount, error: urlError } = await supabase.from('urls').select('*', { count: 'exact', head: true });

  const { count: projectCount, error: projectError } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  const today = new Date();
  const { count: manualCount, error: manualError } = await supabase
    .from('batches')
    .select('*', { count: 'exact', head: true })
    .eq('source', 'manual')
    .gte('created_at', `${today.getFullYear()}-${today.getMonth() + 1}-1`);

  if (urlError) {
    console.error(urlError);
  }

  if (projectError) {
    console.error(projectError);
  }

  if (manualError) {
    console.error(manualError);
  }

  if (urlCount === undefined || urlCount === null || projectCount === undefined || projectCount === null) {
    notFound();
  }

  const planKey = plan.toUpperCase() as keyof typeof PLANS;

  return (
    <main className="page-padding">
      <h1>Account</h1>
      <dl className={styles.descriptionList}>
        <dt>Email:</dt>
        <dd>{user?.email}</dd>
        <dt>Plan:</dt>
        <dd>
          {plan}
          {/* {' '}
          <Link href="/pricing" className="fs-subtle">
            Upgrade
          </Link> */}
        </dd>
      </dl>

      <Link href="account/reset-password" className={styles.resetPW}>
        Reset password
      </Link>

      <h2 className={styles.usage}>Usage</h2>
      <dl className={styles.descriptionList}>
        <dt>Projects:</dt>
        <dd>
          {projectCount}/{PLANS[planKey].PROJECTS}
        </dd>
        <dt>URLs:</dt>
        <dd>
          {urlCount}/{PLANS[planKey].URLS}
        </dd>
        <dt>Manual reports:</dt>
        <dd>
          {manualCount}/{PLANS[planKey].MANUAL_REPORTS}
        </dd>
      </dl>
    </main>
  );
}
