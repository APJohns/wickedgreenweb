'use client';

import { ChangeEvent, useId, useRef, useState } from 'react';
import styles from './carbonContext.module.css';

interface Props {
  co2: number;
  intensity: number;
}

export default function CarbonContext(props: Props) {
  const [visits, setVisits] = useState(1000);

  const visitsInput = useRef<HTMLInputElement>(null);

  const visitsInputID = useId();

  const carbonContext = {
    tea: 0.025 * props.intensity, // kWh per cup
    car: 400, // gCO2 per mile
  };

  const formatNumber = (number: number): string => {
    let maximumFractionDigits = 2;
    if (number >= 100) {
      maximumFractionDigits = 0;
    }
    return new Intl.NumberFormat(navigator.language, { maximumFractionDigits }).format(number);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      setVisits(value);
    }
  };

  return (
    <div className={styles.context}>
      <h2>Thats like...</h2>
      <p className={styles.contextVisits}>
        <span aria-hidden="true">Per</span>
        <label className={styles.visitsControl}>
          <span className="visually-hidden">Page visits</span>
          <input
            ref={visitsInput}
            id={visitsInputID}
            value={visits}
            inputMode="numeric"
            className={styles.visitsInput}
            onChange={handleChange}
          />{' '}
        </label>
        <span aria-hidden="true">visits</span>
        <output htmlFor={visitsInputID}>
          ({formatNumber(props.co2 * visits)}&thinsp;g CO<sub>2</sub>)
        </output>
      </p>
      <ul className={styles.contextList}>
        <li>
          <output htmlFor={visitsInputID}>{formatNumber((props.co2 / props.intensity) * visits)}</output>&thinsp;kWh of
          energy
        </li>
        <li>
          Boiling <output htmlFor={visitsInputID}>{formatNumber(props.co2 * visits * carbonContext.tea)}</output> cups
          of tea
        </li>
        <li>
          Driving a gas car for{' '}
          <output htmlFor={visitsInputID}>{formatNumber((props.co2 * visits) / carbonContext.car)}</output> miles
        </li>
      </ul>
    </div>
  );
}
