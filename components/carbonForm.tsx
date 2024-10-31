'use client';

import { FormEvent, useRef, useState } from 'react';
import styles from './carbonForm.module.css';

export default function CarbonForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isSubmitting) {
      setIsSubmitting(true);
      formRef.current?.submit();
    }
  };

  return (
    <form ref={formRef} action="report" className={styles.urlForm} onSubmit={onSubmit}>
      <label>
        <div className="visually-hidden">URL</div>
        <input
          type="url"
          name="url"
          className={styles.urlFormInput}
          placeholder="e.g. https://www.example.com"
          required
        />
      </label>
      <button type="submit" className={styles.urlFormSubmit} disabled={isSubmitting}>
        Calculate
      </button>
    </form>
  );
}
