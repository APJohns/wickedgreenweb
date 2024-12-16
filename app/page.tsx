import CarbonForm from '@/components/carbonForm';
import styles from './page.module.css';
import Logo from '@/components/logo';

export default async function Home() {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            <Logo />
          </h1>
          <CarbonForm />
        </div>
      </main>
    </>
  );
}
