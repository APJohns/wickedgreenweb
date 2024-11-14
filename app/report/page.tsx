import Link from 'next/link';
import styles from './page.module.css';
import CarbonContext from '@/components/carbonContext';
import StatCard from '@/components/statCard';
import { formatBytes, formatCO2 } from '@/utils/utils';
import StatCardGroup from '@/components/statCardGroup';

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
  const url = (await searchParams).url;
  let data;
  if (url) {
    const res = await fetch(`${process.env.API_URL}/co2?url=${url}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });
    if (!res.ok) {
      throw Error(await res.text());
    }
    console.log(res);
    data = await res.json();
  }

  const pageWeight = formatBytes(data.report.variables.bytes);

  return (
    <main className={styles.main}>
      <h1>Report</h1>
      {typeof url === 'string' && (
        <Link href={url} className={styles.url}>
          {url}
        </Link>
      )}
      {data.report && <p className={styles.rating}>{data.report.co2.rating}</p>}
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

        {data.report && (
          <StatCard heading="Page weight" unit={pageWeight.unit}>
            {pageWeight.value}
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
