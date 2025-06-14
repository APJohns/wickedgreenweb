import Link from 'next/link';
import styles from './page.module.css';
import CarbonContext from '@/components/carbonContext';
import StatCard from '@/components/statCard';
import { addHTTPS, formatBytes, formatCO2 } from '@/utils/utils';
import StatCardGroup from '@/components/statCardGroup';
import TypesBarChart from '@/components/typesBarChart';
import { AVERAGE_CO2 } from '@/utils/constants';

export const maxDuration = 60;

interface SupportingDocument {
  id: number;
  title: string;
  link: string;
}

export default async function Report({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const urlData = (await searchParams).url as string;
  const url = addHTTPS(urlData);
  let data;
  if (urlData) {
    const res = await fetch(`${process.env.API_URL}/co2?url=${url}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });
    if (!res.ok) {
      throw Error(await res.text());
    }
    data = await res.json();
  }

  interface Resource {
    url: string;
    transferSize: number;
    mimeType: string;
  }

  const typeTotals = {
    HTML: 0,
    CSS: 0,
    JS: 0,
    Fonts: 0,
    Images: 0,
    Other: 0,
  };

  data.requestData.resources.forEach((resource: Resource) => {
    if (resource.mimeType.includes('html')) {
      typeTotals.HTML += resource.transferSize;
    } else if (resource.mimeType.includes('css')) {
      typeTotals.CSS += resource.transferSize;
    } else if (resource.mimeType.includes('javascript')) {
      typeTotals.JS += resource.transferSize;
    } else if (resource.mimeType.includes('font')) {
      typeTotals.Fonts += resource.transferSize;
    } else if (resource.mimeType.includes('image')) {
      typeTotals.Images += resource.transferSize;
    } else {
      typeTotals.Other += resource.transferSize;
    }
  });

  const chartData = Object.keys(typeTotals)
    .map((type) => {
      return {
        type,
        bytes: typeTotals[type as keyof typeof typeTotals],
      };
    })
    .sort((a, b) => b.bytes - a.bytes);

  const pageWeight = formatBytes(data.report.variables.bytes);

  const againstAverage = ((data.report.co2.total - AVERAGE_CO2) / AVERAGE_CO2) * 100;

  return (
    <main className={'page-padding page-padding-v ' + styles.main}>
      <h1>Report</h1>
      <Link href={url} className={styles.url}>
        {url}
      </Link>
      {data.report && <p className={styles.rating}>{data.report.co2.rating}</p>}
      {data.report && (
        <p>
          {Math.abs(againstAverage).toFixed(1)}%{againstAverage <= 0 ? <strong> less</strong> : <strong> more</strong>}{' '}
          CO<sub>2</sub> than the average page
        </p>
      )}
      <StatCardGroup>
        {data.report && (
          <StatCard
            heading="Emissions"
            unit={
              <>
                g CO<sub>2</sub>
              </>
            }
            info="per visit"
          >
            {formatCO2(data.report.co2.total)}
          </StatCard>
        )}

        {data.hosting && (
          <StatCard heading="Hosting">
            {data.hosting.green ? 'Green' : 'Dirty'}
            {data.hosting.green && data.hosting.supporting_documents.length > 0 && (
              <details className={`${styles.info} ${styles.hostInfo}`}>
                <summary>{data.hosting.hosted_by}</summary>
                <ul>
                  {data.hosting.supporting_documents.map((doc: SupportingDocument) => (
                    <li key={doc.id}>
                      <a href={doc.link}>{doc.title}</a>
                    </li>
                  ))}
                </ul>
              </details>
            )}
            {data.hosting.green && data.hosting.supporting_documents.length === 0 && (
              <div className={styles.info}>{data.hosting.hosted_by}</div>
            )}
          </StatCard>
        )}
      </StatCardGroup>
      <div className={styles.card}>
        <div className={styles.cardInfo}>
          <h2 className={styles.cardTitle}>Page weight</h2>
          <p className={styles.statValue}>
            {pageWeight.value}
            <span className={styles.unit}> {pageWeight.unit}</span>
          </p>
        </div>
        <div className={styles.cardChart}>
          <TypesBarChart data={chartData} />
        </div>
      </div>
      <CarbonContext co2={data.report.co2.total} intensity={data.report.variables.gridIntensity.device.value} />
      <Link href="/" className={styles.backLink}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Check another page
      </Link>
    </main>
  );
}
