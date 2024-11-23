import { PropsWithChildren, SelectHTMLAttributes } from 'react';
import styles from './select.module.css';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  inline?: boolean;
}

export default function Select({ label, inline, children, ...attrs }: PropsWithChildren<Props>) {
  return (
    <label className="form-control">
      <div className="form-control-label">{label}</div>
      <div className={`${styles.select} ${inline ? styles.inline : ''}`}>
        <select name="reportFrequency" className={`form-control-input ${styles.selectInput}`} {...attrs}>
          {children}
        </select>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={styles.chevron}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </label>
  );
}
