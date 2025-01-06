import { formatBytes, formatCO2, getRating } from '@/utils/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import StatCard from '@/components/statCard';
import styles from './project.module.css';
import CO2Chart, { CO2Point } from './co2Chart';
import StatCardGroup from '@/components/statCardGroup';
import { createClient, getProjectName } from '@/utils/supabase/server';
import DateTime from '@/components/datetime';
import { FormMessage, Message } from '@/components/formMessage';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const projectID = (await params).id;
  const projectName = await getProjectName(projectID);

  return {
    title: `${projectName} | Wicked Green Web`,
  };
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Message>;
}) {
  const searchParameters = await searchParams;
  const projectID = (await params).id;
  const projectName = await getProjectName(projectID);

  const supabase = await createClient();

  const { data: batches } = await supabase
    .from('batches')
    .select()
    .eq('project_id', projectID)
    .order('created_at', { ascending: false });

  const { data, error } = await supabase
    .from('reports')
    .select(
      `
      co2,
      rating,
      bytes,
      created_at,
      batch_id,
      batches!inner(
        project_id
      )
    `
    )
    .eq(`batches.project_id`, projectID);

  if (error) {
    console.error(error);
  }

  if (!data || !batches) {
    notFound();
  }

  const latestBatchReports = data?.filter((report) => report.batch_id === batches[0].id);

  if (data.length === 0) {
    return (
      <>
        <h1>{projectName}</h1>
        <p>Welcome! It may look a little empty now, but check back once your first reports are in!</p>
        <Link href={`/dashboard/projects/${projectID}/urls/add`}>Add URLs</Link>
      </>
    );
  }

  const getAverage = (values: number[]) => {
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    return sum / values.length;
  };

  const byBatch = Object.groupBy(data, (report) => report.batch_id);
  const averages: CO2Point[] = Object.keys(byBatch).map((batchID) => {
    const date = new Date(batches.find((b) => b.id === batchID)!.created_at);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return {
      date,
      co2: getAverage(Array.from(byBatch[batchID] || [], (d) => d.co2)),
    };
  });

  averages.sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf());

  const latestCO2 = Array.from(latestBatchReports, (report) => report.co2);
  const bytes = formatBytes(getAverage(Array.from(latestBatchReports, (report) => report.bytes)));
  let totalChange: number | null = null;
  let annualChange: number | null = null;
  const earliestAllTime = averages.at(-1);
  const earliestThisYear = averages.filter((d) => new Date(d.date).getFullYear() === new Date().getFullYear()).at(-1);
  if (earliestAllTime) {
    totalChange = (averages[0].co2 / earliestAllTime.co2) * 100 - 100;
  }
  if (earliestThisYear) {
    annualChange = (averages[0].co2 / earliestThisYear.co2) * 100 - 100;
  }

  return (
    <>
      <FormMessage message={searchParameters} />
      <h1>{projectName}</h1>
      <p>
        Last updated on <DateTime date={new Date(averages[averages.length - 1].date)} />
      </p>
      <StatCardGroup heading="Averages">
        <StatCard heading="Rating" headingLevel="h3">
          {getRating(getAverage(latestCO2))}
        </StatCard>
        <StatCard
          heading="Emissions"
          headingLevel="h3"
          info="per visit"
          unit={
            <>
              g CO<sub>2</sub>
            </>
          }
        >
          {formatCO2(getAverage(latestCO2))}
        </StatCard>
        <StatCard heading="Page weight" headingLevel="h3" unit={bytes.unit}>
          {bytes.value}
        </StatCard>
        {annualChange && (
          <StatCard heading="Annual change" headingLevel="h3" unit="%" info="this year">
            {annualChange?.toFixed(2)}
          </StatCard>
        )}
        {totalChange && (
          <StatCard heading="Net change" headingLevel="h3" unit="%" info="since start">
            {totalChange?.toFixed(2)}
          </StatCard>
        )}
      </StatCardGroup>
      <div className={styles.chartGroup}>
        <CO2Chart data={averages} />
      </div>
    </>
  );
}
