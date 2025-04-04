'use client';

import { addURLAction, getURLCount } from '@/app/actions/urls';
import { FormMessage, Message } from '@/components/formMessage';
import { getPlan } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { PLANS } from '@/utils/constants';
// import { Metadata } from 'next';
import { use, useEffect, useState } from 'react';
import styles from './add.module.css';

/* export const metadata: Metadata = {
  title: 'Add URL | Wicked Green Web',
}; */

export default function AddUrlPage(props: { searchParams: Promise<Message>; params: Promise<{ id: string }> }) {
  const searchParams = use(props.searchParams);
  const projectID = use(props.params).id;

  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    const setup = async () => {
      const plan = await getPlan();
      const planKey = plan.toUpperCase() as keyof typeof PLANS;
      setLimit(PLANS[planKey].URLS);
      const count = await getURLCount();
      if (!count) {
        notFound();
      } else {
        setCount(count);
      }
    };
    setup();
  }, []);

  if (count >= limit) {
    return (
      <>
        <h1>Add URLs</h1>
        {/* <p>
          <Link href="/pricing">Upgrade to Pro</Link> to add more URLs.
        </p> */}
        <p>
          Features are limited as we roll out Wicked Green Web. You may only have {PLANS.FREE.URLS} URLs. We&apos;ll
          update you when this changes.
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Add URLs</h1>
      <p className="text-subtle">
        {count} of {limit} urls used
      </p>
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
