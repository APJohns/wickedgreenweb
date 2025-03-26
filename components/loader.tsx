import styles from './loader.module.css';

interface Props {
  isLoading?: boolean;
}

export default function Loader({ isLoading = true }: Props) {
  return (
    <div className={isLoading ? styles.loader : undefined}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="12" fill="black" className={styles.svgFill} />
        <g className={styles.outerOrbit}>
          <circle cx="40" cy="40" r="36" stroke="black" className={styles.svgStroke} />
          <circle cx="76" cy="40" r="4" fill="#5BC871" />
          <circle cx="4" cy="40" r="4" fill="#5BC871" />
          <circle cx="40" cy="76" r="4" fill="#5BC871" />
          <circle cx="40" cy="4" r="4" fill="#5BC871" />
        </g>
        <g className={styles.innerOrbit}>
          <circle cx="40" cy="40" r="25" stroke="black" className={styles.svgStroke} />
          <circle cx="40" cy="16" r="4" fill="#5BC871" />
          <circle cx="40" cy="64" r="4" fill="#5BC871" />
        </g>
      </svg>
    </div>
  );
}
