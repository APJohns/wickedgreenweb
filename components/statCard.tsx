import { PropsWithChildren } from 'react';
import styles from './statCard.module.css';
import Heading, { HeadingLevel } from './Heading';

interface Props {
  heading: string | JSX.Element;
  headingLevel?: HeadingLevel;
  unit?: string | JSX.Element;
  info?: string | JSX.Element;
}

export default function StatCard({ heading, headingLevel = 'h2', unit, info, children }: PropsWithChildren<Props>) {
  return (
    <div className={styles.statCard}>
      <Heading level={headingLevel} className={styles.heading}>
        {heading}
      </Heading>
      <div className={styles.body}>
        <span className={styles.stat}>{children}</span>
        {unit && <span className={styles.unit}>{unit}</span>}
        {info && <span className={styles.info}>{info}</span>}
      </div>
    </div>
  );
}
