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

  const plan = getPlan();

  const { count: urlCount, error: urlError } = await supabase.from('urls').select('*', { count: 'exact', head: true });

  const { count: projectCount, error: projectError } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  if (urlError) {
    console.error(urlError);
  }

  if (projectError) {
    console.error(projectError);
  }

  if (urlCount === undefined || urlCount === null || projectCount === undefined || projectCount === null) {
    notFound();
  }

  return (
    <main>
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
          {projectCount}/{PLANS.FREE.PROJECTS}
        </dd>
        <dt>URLs:</dt>
        <dd>
          {urlCount}/{PLANS.FREE.URLS}
        </dd>
      </dl>
    </main>
  );
}
