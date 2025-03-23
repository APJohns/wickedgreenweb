'use client';

import { manualReport } from '@/app/actions/reports';
import { getThisMonthsManualBatchCount } from '@/app/actions/utilities';
import { PLANS } from '@/utils/constants';
import { getPlan } from '@/utils/supabase/server';
import { useCallback, useEffect, useState } from 'react';

export default function Manual({ params }: { params: Promise<{ id: string }> }) {
  const [projectID, setProjectID] = useState('');
  const [limit, setLimit] = useState(0);
  const [count, setCount] = useState(0);

  const update = useCallback(async () => {
    setProjectID((await params).id);
    const plan = await getPlan();
    setLimit(plan === 'free' ? PLANS.FREE.MANUAL_REPORTS : PLANS.PRO.MANUAL_REPORTS);

    const count = await getThisMonthsManualBatchCount();
    setCount(count || 0);
  }, [params]);

  useEffect(() => {
    update();
  }, [update]);

  if (count === null || count >= limit) {
    return (
      <>
        <h1>Manual report</h1>
        {/* TODO: Add not about either waiting until next month or upgrade to pro */}
        <p>You have run out of manual reports for this month.</p>
      </>
    );
  }

  return (
    <form action={manualReport}>
      <h1>Manual report</h1>
      <p className="text-subtle">{limit - (count || 0)} manual reports remaining this month</p>
      <p>
        It may take a few minutes to run your report. This will happen in the background and your manual report will
        show up in your reports page soon.
      </p>
      <input type="hidden" name="projectID" value={projectID} />
      <button type="submit" className="form-submit" disabled={count === null || count >= limit}>
        Run report
      </button>
    </form>
  );
}
