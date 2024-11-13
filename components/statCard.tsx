import { PropsWithChildren } from 'react';
import styles from './statCard.module.css';

interface Props {
  heading: string | JSX.Element;
  unit?: string | JSX.Element;
  info?: string | JSX.Element;
}

export default function StatCard({ heading, unit, info, children }: PropsWithChildren<Props>) {
  return (
    <div className={styles.statCard}>
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.body}>
        <span className={styles.stat}>{children}</span>
        {unit && <span className={styles.unit}>{unit}</span>}
        {info && <span className={styles.info}>{info}</span>}
      </div>
    </div>
  );
}
