'use client';

import { deleteProjectAction } from '@/app/actions';
import { useRef } from 'react';
import styles from '@/components/modal.module.css';

interface Props {
  projectID: string;
}

export default function Delete(props: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        className={`icon-action ${styles.deleteModalTrigger}`}
        onClick={() => dialogRef.current?.showModal()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
        Delete project
      </button>
      <dialog ref={dialogRef} className={styles.modal}>
        <h3 className={styles.modalHeading}>Delete project</h3>
        <form action={deleteProjectAction}>
          <div className={styles.modalBody}>
            <p>Are you sure you want to delete this project?</p>
            <p>This action cannot be undone and all reports under this project will be deleted.</p>
          </div>
          <input type="hidden" name="projectID" value={props.projectID} />
          <div className={styles.modalActions}>
            <button type="button" className={styles.modalActionCancel} onClick={() => dialogRef.current?.close()}>
              Cancel
            </button>
            <button type="submit" className={`${styles.modalActionAffirm} ${styles.negative}`}>
              Delete
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
