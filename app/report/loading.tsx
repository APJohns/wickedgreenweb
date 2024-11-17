import Loader from '@/components/loader';
import styles from './loading.module.css';

export default function Loading() {
  function getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }

  const loadingMessages = ['Counting carbon atoms'];

  return (
    <main className={styles.main}>
      <Loader />
      <p className={styles.loading}>{loadingMessages[getRandomInt(0, loadingMessages.length)]}</p>
      <p>This should only take a few seconds</p>
    </main>
  );
}
