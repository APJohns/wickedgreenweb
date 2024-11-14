import { PropsWithChildren } from 'react';
import styles from './statCardGroup.module.css';
import Heading, { HeadingLevel } from './Heading';

interface Props {
  heading?: string;
  headingLevel?: HeadingLevel;
}

export default function StatCardGroup({ heading, headingLevel = 'h2', children }: PropsWithChildren<Props>) {
  if (heading) {
    return (
      <div className={styles.cardGroupContainer}>
        <Heading level={headingLevel}>{heading}</Heading>
        <div className={styles.cardGroup}>{children}</div>
      </div>
    );
  } else {
    return <div className={`${styles.cardGroup} ${styles.cardGroupContainer}`}>{children}</div>;
  }
}
