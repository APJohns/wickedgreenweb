import Link from 'next/link';
import styles from './page.module.css';
import CarbonContext from '@/components/carbonContext';

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
    const res = await fetch(`${process.env.API_URL}/carbon?url=${url}`, {
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

  interface FormattedBytes {
    value: number;
    unit: string;
  }

  function formatBytes(bytes: number, decimals?: number): FormattedBytes {
    if (bytes == 0) {
      return {
        value: 0,
        unit: 'Bytes',
      };
    }
    const k = 1000,
      dm = decimals || 2,
      sizes = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return {
      value: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),
      unit: sizes[i],
    };
  }

  const pageWeight = formatBytes(data.report.variables.bytes);

  const isMilligrams = data.report.co2.total < 0.01;
  const emissions = {
    value: isMilligrams ? data.report.co2.total * 1000 : data.report.co2.total,
    unit: isMilligrams ? 'mg' : 'g',
  };
  console.log(data.report.co2.total, emissions);

  return (
    <main className={styles.main}>
      <h1>Report</h1>
      {typeof url === 'string' && (
        <Link href={url} className={styles.url}>
          {url}
        </Link>
      )}
      {data.report && <p className={styles.rating}>{data.report.co2.rating}</p>}
      <div className={styles.cardGroup}>
        {data.report && (
          <div className={styles.statCard}>
            <h2 className={styles.heading}>Emissions</h2>
            <p className={styles.body}>
              <span className={styles.stat}>
                {isMilligrams ? <>&lt;&thinsp;0.01</> : data.report.co2.total.toFixed(2)}
              </span>
              <span className={styles.unit}>
                g CO<sub>2</sub>
              </span>
              <span className={styles.info}>per visit</span>
            </p>
          </div>
        )}
        {data.report && (
          <div className={styles.statCard}>
            <h2 className={styles.heading}>Page Weight</h2>
            <p className={styles.body}>
              <span className={styles.stat}>{pageWeight.value}</span>
              <span className={styles.unit}>{pageWeight.unit}</span>
            </p>
          </div>
        )}
        {data.hosting && (
          <div className={styles.statCard}>
            <h2 className={styles.heading}>Hosting</h2>
            <div className={styles.body}>
              <p className={styles.stat}>{data.hosting.green ? 'Green' : 'Dirty'}</p>
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
                <p className={styles.info}>{data.hosting.hosted_by}</p>
              )}
            </div>
          </div>
        )}
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
