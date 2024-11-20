import { formatBytes, formatCO2 } from '@/utils/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import StatCard from '@/components/statCard';
import styles from './project.module.css';
import CO2Chart from './co2Chart';
import { SWDMV4_PERCENTILES, SWDMV4_RATINGS } from '@/utils/constants';
import StatCardGroup from '@/components/statCardGroup';
import { getProjectName, getURLReports } from '@/utils/supabase/server';

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const projectID = (await params).id;
  const projectName = await getProjectName(projectID);

  const data = await getURLReports(projectID);

  if (!data) {
    notFound();
  }

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

  if (Array.from(data, (d) => d.reports).flat().length === 0) {
    return (
      <>
        <h1>{projectName}</h1>
        <div className={styles.urls}>
          {/* TODO: Change "tomorrow" to match cadence of final crawl rate */}
          <p>Check back after the next scan tomorrow to see your results.</p>
          <Link href={`/dashboard/projects/${projectID}/urls`}>See all {data.length} URLs</Link>
        </div>
      </>
    );
  }

  const getAverage = (values: number[]) => {
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    return sum / values.length;
  };

  const byDate: { [key: string]: number[] } = {};
  data.forEach((url) => {
    url.reports.forEach((report) => {
      const date = new Date(report.created_at).toDateString();
      if (byDate[date]) {
        byDate[date].push(report.co2);
      } else {
        byDate[date] = [report.co2];
      }
    });
  });

  const averages = Object.keys(byDate).map((date) => {
    return {
      date,
      co2: getAverage(byDate[date]),
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

  const latestCO2 = Array.from(data, (url) => (url.reports[0] ? url.reports[0].co2 : undefined)).filter(
    (d) => d !== undefined
  );
  const bytes = formatBytes(
    getAverage(
      Array.from(data, (url) => (url.reports[0] ? url.reports[0].bytes : undefined)).filter((d) => d !== undefined)
    )
  );

  return (
    <>
      <h1>{projectName}</h1>
      <p>Last updated on {new Date(averages[averages.length - 1].date).toLocaleDateString()}</p>
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
