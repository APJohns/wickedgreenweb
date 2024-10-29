import CarbonForm from '@/components/carbonForm';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            <span className={styles.green}>Greener</span>
            <span className={styles.small}>web</span>
          </h1>
          <CarbonForm />
        </div>
      </main>
    </>
  );
}
