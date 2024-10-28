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
          <form action="report" className={styles.urlForm}>
            <label>
              <div className="visually-hidden">URL to scan</div>
              <input type="url" name="url" className={styles.urlFormInput} required />
            </label>
            <button type="submit" className={styles.urlFormSubmit}>
              Estimate Carbon
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
