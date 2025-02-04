'use client';

import { Tables } from '@/database.types';
import Delete from './delete';
import styles from './urls.module.css';
import { deleteURLsAction, updateGreenHosting, URLsToUpdate } from '@/app/actions/urls';
import { ChangeEvent, useEffect, useState } from 'react';

type U = Pick<Tables<'urls'>, 'id' | 'url' | 'green_hosting_factor'>;

type URL = U & {
  reports: {
    count: number;
  }[];
};

interface Props {
  urls: URL[];
  projectID: string;
}

export default function ManageURLs(props: Props) {
  const [checkedURLs, setCheckedURLs] = useState<URLsToUpdate[]>([]);
  const [urls, setURLs] = useState<URL[]>(props.urls);
  const [isRechecking, setIsRechecking] = useState(false);

  const recheckHosting = async () => {
    setIsRechecking(true);
    const updatedURLs = await updateGreenHosting(checkedURLs);
    const toUpdate = [...urls];
    urls.map((url) => {
      const match = updatedURLs.find((u) => u?.id === url.id);
      if (match && url.id === match?.id) {
        url.green_hosting_factor = match.green_hosting_factor;
      }
    });
    setURLs(toUpdate);
    setIsRechecking(false);
  };

  const toggleCheck = (e: ChangeEvent<HTMLInputElement>, id: string, url: string) => {
    if (e.target.checked) {
      const newChecked = [...checkedURLs];
      newChecked.push({
        id,
        url,
      });
      setCheckedURLs(newChecked);
    } else {
      setCheckedURLs([...checkedURLs].filter((d) => d.id !== id));
    }
  };

  useEffect(() => {}, []);

  return (
    <form action={deleteURLsAction}>
      <input type="hidden" name="projectID" value={props.projectID} />
      <div className={styles.tableActions}>
        <Delete />
        <button className="icon-action button-subtle" type="button" disabled={isRechecking} onClick={recheckHosting}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={isRechecking ? styles.isRechecking : ''}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Re-check hosting
        </button>
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>URL</th>
              <th>Hosting</th>
              <th>Total reports</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url) => (
              <tr key={url.id}>
                <td>
                  <input type="checkbox" name={url.id} onChange={(e) => toggleCheck(e, url.id, url.url)} />
                </td>
                <td>{url.url}</td>
                <td>{url.green_hosting_factor === 1 ? 'Green' : 'Dirty'}</td>
                <td>{url.reports[0].count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
}
