'use client';

import { FormEvent, useRef, useState } from 'react';
import styles from './carbonForm.module.css';
import { addHTTPS } from '@/utils/utils';

export default function CarbonForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isSubmitting) {
      if (inputRef.current) {
        try {
          new URL(addHTTPS(inputRef.current.value));
          setIsSubmitting(true);
          formRef.current?.submit();
        } catch {
          setErrorMessage('Invalid URL');
        }
      }
    }
  };

  return (
    <form ref={formRef} action="report" className={styles.urlForm} onSubmit={onSubmit}>
      <label>
        <div className="visually-hidden">URL</div>
        <div className={styles.urlFormControl}>
          <div className={styles.urlFormInputAddon}>https://</div>
          <input
            ref={inputRef}
            type="text"
            inputMode="url"
            name="url"
            className={styles.urlFormInput}
            required
            aria-invalid={errorMessage ? 'true' : undefined}
            aria-errormessage={errorMessage ? 'errorMessage' : undefined}
          />
        </div>
      </label>
      {errorMessage && <p id="errorMessage">{errorMessage}</p>}
      <button type="submit" className={styles.urlFormSubmit} disabled={isSubmitting}>
        Calculate
      </button>
    </form>
  );
}
