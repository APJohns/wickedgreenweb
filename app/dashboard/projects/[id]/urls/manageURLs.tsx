'use client';

import { Tables } from '@/database.types';
import { deleteURLsAction } from '@/app/actions';
import Delete from './delete';
import styles from './urls.module.css';

type U = Pick<Tables<'urls'>, 'id' | 'url' | 'green_hosting_factor'>;

type URL = U & {
  reports: {
    count: number;
  }[];
};

interface Props {
  urls: URL[];
}

export default function ManageURLs(props: Props) {
  return (
    <form action={deleteURLsAction}>
      <div className={styles.tableActions}>
        <Delete />
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>URL</th>
              <th>Total reports</th>
            </tr>
          </thead>
          <tbody>
            {props.urls.map((url) => (
              <tr key={url.id}>
                <td>
                  <input type="checkbox" name={url.id} />
                </td>
                <td>{url.url}</td>
                <td>{url.reports[0].count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
}
