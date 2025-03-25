import CarbonForm from '@/components/carbonForm';
import styles from './page.module.css';
import Link from 'next/link';

export default async function Home() {
  return (
    <>
      <main className={'page-padding ' + styles.main}>
        <div className={`${styles.hero}`}>
          <h1 className={styles.title}>Let&apos;s clean up our corner of the web</h1>
          <Link href="/sign-up" className="cta">
            Start measuring now!
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
        <section className={`${styles.tryItOut}`}>
          <CarbonForm />
        </section>
      </main>
    </>
  );
}
