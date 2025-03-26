import Link from 'next/link';
import styles from './plans.module.css';
import { PLANS } from '@/utils/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plans | Wicked Green Web',
};

export default function PlansPage() {
  return (
    <main className="page-padding">
      <h1>Plans</h1>
      <p>Wicked Green Web is in beta. Plan details and pricing are subject to change.</p>
      <div className={styles.plans}>
        <div className={styles.plan}>
          <h2>Free</h2>
          <p>Everything you need to start going green.</p>
          <div className={styles.price}>
            $0<span className={styles.priceFrequency}> per month</span>
          </div>
          <ul className={styles.featuresList}>
            <li>{PLANS.FREE.PROJECTS} project</li>
            <li>{PLANS.FREE.URLS} URLs</li>
            <li>{PLANS.FREE.MANUAL_REPORTS} manual reports per month</li>
            <li>Weekly & monthly reports</li>
          </ul>
          <div className={styles.action}>
            <Link href="sign-up" className={`cta ${styles.planCTA}`}>
              Get started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
        <div className={styles.plan}>
          <h2>Pro</h2>
          <p>Clean up your corner of the internet.</p>
          <div className={styles.price}>
            TBD<span className={styles.priceFrequency}> per month</span>
          </div>
          <ul className={styles.featuresList}>
            <li>{PLANS.PRO.PROJECTS} projects</li>
            <li>{PLANS.PRO.URLS} URLs</li>
            <li>{PLANS.PRO.MANUAL_REPORTS} manual reports per month</li>
            <li>Daily reports</li>
            <li>Configure model variables</li>
          </ul>
          <div className={styles.action}>
            <div className={styles.ctaSoon}>Coming soon...</div>
          </div>
        </div>
      </div>
    </main>
  );
}
