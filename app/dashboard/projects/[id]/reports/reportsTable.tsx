'use client';

import DateTime from '@/components/datetime';
import Loader from '@/components/loader';
import { Tables } from '@/database.types';
import { formatBytes, formatCO2 } from '@/utils/utils';
import { useCallback, useEffect, useState } from 'react';
import styles from './reports.module.css';
import { getReports } from '@/app/actions';

interface Reports extends Tables<'reports'> {
  urls: Tables<'urls'>;
}

interface Props {
  projectID: string;
  batches: Tables<'batches'>[];
}

export default function ReportsTable({ projectID, batches }: Props) {
  const [reports, setReports] = useState<Reports[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const updateReports = useCallback(
    async (batchID: string) => {
      const data = await getReports(batchID, projectID);
      if (data) {
        setReports(data);
        setIsLoading(false);
      }
    },
    [projectID]
  );

  useEffect(() => {
    updateReports(batches[0].id);
  }, [batches, updateReports]);

  return (
    <div>
      <div className={styles.filters}>
        <label className="form-control">
          <div className="form-control-label">Report date</div>
          <select className="form-control-input inline" onChange={(e) => updateReports(e.target.value)}>
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                <DateTime date={new Date(batch.created_at)} />
              </option>
            ))}
          </select>
        </label>
      </div>
      {isLoading ? (
        <div className={styles.tableLoader}>
          <Loader />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <caption className="visually-hidden">
              A list of all URLs in the project and their most recent report results
            </caption>
            <thead>
              <tr>
                <th>URL</th>
                <th>Hosting</th>
                <th>Page weight</th>
                <th>
                  CO<sub>2</sub>
                </th>
                <th>Rating</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => {
                return (
                  <tr key={report.id}>
                    {report.urls && (
                      <>
                        <td>{new URL(report.urls.url).pathname}</td>
                        <td>{report.urls.green_hosting_factor === 1 ? 'Green' : 'Dirty'}</td>
                      </>
                    )}
                    <td>
                      {formatBytes(report.bytes).value}&thinsp;{formatBytes(report.bytes).unit}
                    </td>
                    <td>{formatCO2(report.co2)}&thinsp;g</td>
                    <td>{report.rating}</td>
                    <td>
                      <DateTime datetime={new Date(report.created_at)} options={{ timeZoneName: 'short' }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
