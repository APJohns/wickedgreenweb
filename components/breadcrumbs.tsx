'use client';

import Link from 'next/link';
import styles from './breadcrumbs.module.css';

interface BreadcrumbsProps {
  crumbs: {
    text: string;
    href?: string;
  }[];
}

export default function Breadcrumbs(props: BreadcrumbsProps) {
  return (
    <nav aria-label="breadcrumbs">
      <ol className={styles.breadcrumbsList}>
        {props.crumbs.map((crumb) => (
          <li key={'crumb-' + crumb.text} className={styles.crumb}>
            {crumb.href && <Link href={crumb.href}>{crumb.text}</Link>}
            {!crumb.href && <div className={styles.currentPage}>{crumb.text}</div>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
