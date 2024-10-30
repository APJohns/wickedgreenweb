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
              <span className={styles.stat}>{data.report.co2.total.toFixed(2)}</span>
              <span className={styles.unit}>
                g CO<sub>2</sub>
              </span>
              <span className={styles.info}>per visit</span>
            </p>
          </div>
        )}
        {data.report && (
          <div className={styles.statCard}>
            <h2 className={styles.heading}>Page Size</h2>
            <p className={styles.body}>
              <span className={styles.stat}>{(data.report.variables.bytes / 1000).toFixed(2)}</span>
              <span className={styles.unit}>kB</span>
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
      {/* <p>{data.report.variables.gridIntensity}</p> */}
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
