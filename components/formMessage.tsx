import styles from './formMessage.module.css';

export type Message = { success: string } | { error: string } | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className={styles.toast} role="alert">
      {'success' in message && <p className={styles.success}>{message.success}</p>}
      {'error' in message && <p className={styles.error}>{message.error}</p>}
      {'message' in message && <p className={styles.message}>{message.message}</p>}
    </div>
  );
}
