import { formatBytes, formatCO2 } from '@/utils/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import StatCard from '@/components/statCard';
import styles from './project.module.css';
import CO2Chart, { CO2Point } from './co2Chart';
import { SWDMV4_PERCENTILES, SWDMV4_RATINGS } from '@/utils/constants';
import StatCardGroup from '@/components/statCardGroup';
import { createClient, getProjectName } from '@/utils/supabase/server';
import DateTime from '@/components/datetime';

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
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
  // .order('created_at', { ascending: false });
  // .order('created_at', { referencedTable: 'reports', ascending: false });
  if (error) {
    console.error(error);
  }

  // const data = await getURLReports(projectID);

  if (!data || !batches) {
    notFound();
  }

  const latestBatchReports = data?.filter((report) => report.batch_id === batches[0].id);

  if (data.length === 0) {
    return (
      <>
        <h1>{projectName}</h1>
        <div className={styles.urls}>
          <p>Welcome! Let&apos;s add some URLs to this project.</p>
          <Link href={`/dashboard/projects/${projectID}/urls/add`}>Add URLs</Link>
        </div>
      </>
    );
  }

  /* if (Array.from(data, (d) => d.reports).flat().length === 0) {
    return (
      <>
        <h1>{projectName}</h1>
        <div className={styles.urls}>
          TODO: Change "tomorrow" to match cadence of final crawl rate
          <p>Check back after the next scan tomorrow to see your results.</p>
          <Link href={`/dashboard/projects/${projectID}/urls`}>See all {data.length} URLs</Link>
        </div>
      </>
    );
  } */

  const getAverage = (values: number[]) => {
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    return sum / values.length;
  };

  const byBatch: { [key: string]: number[] } = {};
  data.forEach((report) => {
    if (byBatch[report.batch_id]) {
      byBatch[report.batch_id].push(report.co2);
    } else {
      byBatch[report.batch_id] = [report.co2];
    }
  });

  const averages: CO2Point[] = Object.keys(byBatch).map((batchID) => {
    const date = new Date(batches.find((b) => b.id === batchID)!.created_at);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return {
      date,
      co2: getAverage(byBatch[batchID]),
    };
  });

  averages.sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf());

  function getRating(co2: number) {
    for (const percentile in SWDMV4_RATINGS) {
      const p = SWDMV4_PERCENTILES[percentile as keyof typeof SWDMV4_PERCENTILES];
      if (p - co2 > 0) {
        return SWDMV4_RATINGS[percentile as keyof typeof SWDMV4_RATINGS];
      }
    }
  }

  const latestCO2 = Array.from(latestBatchReports, (report) => report.co2);
  const bytes = formatBytes(getAverage(Array.from(latestBatchReports, (report) => report.bytes)));

  return (
    <>
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
      </StatCardGroup>
      <div className={styles.chartGroup}>
        <CO2Chart data={averages} />
      </div>
    </>
  );
}
