import styles from './pwRequirements.module.css';

export default function PwRequirements() {
  return (
    <div className={styles.pwRequirements}>
      <p className="fs-subtle">Password requirements...</p>
      <ul className={`${styles.requirementsList} text-subtle`}>
        <li>At least 8 characters</li>
        <li>Contain uppercase letters</li>
        <li>Contain lowercase letters</li>
        <li>Contain numbers</li>
        <li>Contain special characters</li>
      </ul>
    </div>
  );
}
