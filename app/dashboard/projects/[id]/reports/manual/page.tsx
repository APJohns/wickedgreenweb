import { manualReport } from '@/app/actions/reports';
import { PLANS } from '@/utils/constants';
import { createClient, getPlan } from '@/utils/supabase/server';

export default async function ManualReportPage({ params }: { params: Promise<{ id: string }> }) {
  const projectID = (await params).id;

  const supabase = await createClient();

  const plan = await getPlan();
  const limit = plan === 'free' ? PLANS.FREE.MANUAL_REPORTS : PLANS.PRO.MANUAL_REPORTS;

  const today = new Date();

  const { count } = await supabase
    .from('batches')
    .select('*', { count: 'exact', head: true })
    .eq('source', 'manual')
    .gte('created_at', `${today.getFullYear()}-${today.getMonth() + 1}-1`);

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
