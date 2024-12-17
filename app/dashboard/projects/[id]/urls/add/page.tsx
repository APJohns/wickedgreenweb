import { addURLAction } from '@/app/actions/urls';
import { FormMessage, Message } from '@/components/formMessage';
import styles from './add.module.css';
import { createClient, getPlan } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { PLANS } from '@/utils/constants';

export default async function AddUrlPage(props: { searchParams: Promise<Message>; params: Promise<{ id: string }> }) {
  const searchParams = await props.searchParams;
  const projectID = (await props.params).id;
  const plan = await getPlan();

  const supabase = await createClient();
  const { count, error } = await supabase.from('urls').select('*', { count: 'exact', head: true });

  if (error) {
    console.error(error);
  }

  if (count === undefined || count === null) {
    notFound();
  }

  if (plan === 'free' && count >= PLANS.FREE.URLS) {
    return (
      <>
        <h1>Add URLs</h1>
        {/* <p>
          <Link href="/pricing">Upgrade to Pro</Link> to add more URLs.
        </p> */}
        <p>
          Features are limited as we roll out Wicked Green Web. You may only have 10 URLs. We&apos;ll update you when
          this changes.
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Add URLs</h1>
      <form action={addURLAction}>
        <label className="form-control">
          <div className="form-control-label">Single URL</div>
          <input type="url" name="url" className="form-control-input" />
        </label>
        <input type="hidden" name="project_id" value={projectID} />
        <button type="submit" className="form-submit">
          Add
        </button>
      </form>
      <div className={styles.or}>OR</div>
      <form action={addURLAction}>
        <label className="form-control">
          <div className="form-control-label">Multiple URLs from a sitemap</div>
          <textarea name="sitemap" className={`form-control-input ${styles.sitemapTextarea}`} />
        </label>
        <input type="hidden" name="project_id" value={projectID} />
        <button type="submit" className="form-submit">
          Add
        </button>
      </form>
      <FormMessage message={searchParams} />
    </>
  );
}
