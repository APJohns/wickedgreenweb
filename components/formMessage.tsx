'use client';

import { useEffect, useState } from 'react';
import styles from './formMessage.module.css';

export type Message = { success: string } | { error: string } | { message: string };

export function FormMessage({ message }: { message: Message | Promise<Message> }) {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const hide = setTimeout(() => {
      setIsVisible(false);
    }, 6000);

    return () => {
      clearTimeout(hide);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <div className={`${styles.toast} ${isVisible ? '' : 'hidden'}`} role="alert">
          {'success' in message && <p className={styles.success}>{message.success}</p>}
          {'error' in message && <p className={styles.error}>{message.error}</p>}
          {'message' in message && <p className={styles.message}>{message.message}</p>}
        </div>
      )}
    </>
  );
}
