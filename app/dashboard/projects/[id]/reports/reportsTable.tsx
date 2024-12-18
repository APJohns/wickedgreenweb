'use client';

import DateTime from '@/components/datetime';
import Loader from '@/components/loader';
import { Tables } from '@/database.types';
import { formatBytes, formatCO2 } from '@/utils/utils';
import { useCallback, useEffect, useState } from 'react';
import styles from './reports.module.css';
import { getReportsByBatch } from '@/app/actions/reports';
import Select from '@/components/select';

interface Reports extends Tables<'reports'> {
  urls: Tables<'urls'>;
}

interface Props {
  projectID: string;
  batches: Tables<'batches'>[];
}

export default function ReportsTable({ projectID, batches }: Props) {
  /* const toISODateString = (original?: string) => {
    if (original) {
      return new Date(original).toISOString().split('T')[0];
    } else {
      return '';
    }
  }; */

  // const defaultDate = toISODateString(batches.at(0)?.created_at);

  const [reports, setReports] = useState<Reports[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [from, setFrom] = useState(defaultDate);
  // const [to, setTo] = useState(defaultDate);

  const [batchYear, setBatchYear] = useState('');
  const [batchMonth, setBatchMonth] = useState('');
  const [batchDate, setBatchDate] = useState('');
  const [batchTime, setBatchTime] = useState('');

  const [batchYears, setBatchYears] = useState<string[]>([]);
  const [batchMonths, setBatchMonths] = useState<string[]>([]);
  const [batchDates, setBatchDates] = useState<string[]>([]);
  const [batchTimes, setBatchTimes] = useState<string[]>([]);

  // type BatchGroup = { [key: string]: Tables<'batches'> };
  type BatchGroup = Partial<Record<string, Tables<'batches'>[]>>;

  const [years, setYears] = useState<BatchGroup>({});
  const [months, setMonths] = useState<BatchGroup>({});
  const [dates, setDates] = useState<BatchGroup>({});
  // const [times, setTimes] = useState<BatchGroup>({});

  const [batchID, setBatchID] = useState('');

  /* const updateReports = useCallback(
    async (start: string, end: string) => {
      if (start && end) {
        const filterTo = new Date(end);
        filterTo.setUTCDate(filterTo.getUTCDate() + 1);
        filterTo.setUTCHours(0);
        filterTo.setUTCMinutes(0);
        filterTo.setUTCSeconds(0);
        filterTo.setUTCMilliseconds(0);
        const data = await getReports(projectID, start, filterTo.toISOString());
        if (data) {
          setReports(data);
          setIsLoading(false);
        }
      }
    },
    [projectID]
  ); */

  const getBatch = useCallback(async () => {
    setIsLoading(true);
    if (batchID) {
      const data = await getReportsByBatch(batchID, projectID);
      if (data) {
        setReports(data);
        setIsLoading(false);
      }
    }
  }, [batchID, projectID]);

  /* useEffect(() => {
    updateReports(defaultDate, defaultDate);
  }, [batches, defaultDate, updateReports]); */

  useEffect(() => {
    const y = Object.groupBy(batches, ({ created_at }) => new Date(created_at).getFullYear().toString());
    const sorted = Object.keys(y).toSorted((a, b) => Number(a) - Number(b));
    setBatchYears(sorted);
    setBatchYear(sorted.at(-1) || '');
    setYears(y);
  }, [batches]);

  useEffect(() => {
    if (years[batchYear]) {
      const m = Object.groupBy(years[batchYear], ({ created_at }) => new Date(created_at).getMonth() + 1);
      const sorted = Object.keys(m).toSorted((a, b) => Number(a) - Number(b));
      setBatchMonths(sorted);
      setBatchMonth(sorted.at(-1) || '');
      setMonths(m);
    }
  }, [batchYear, years]);

  useEffect(() => {
    if (months[batchMonth]) {
      const d = Object.groupBy(months[batchMonth], ({ created_at }) => new Date(created_at).getDate().toString());
      const sorted = Object.keys(d).toSorted((a, b) => Number(a) - Number(b));
      setBatchDates(sorted);
      setBatchDate(sorted.at(-1) || '');
      setDates(d);
    }
  }, [batchMonth, months]);

  useEffect(() => {
    if (dates[batchDate]) {
      const t = Object.groupBy(dates[batchDate], ({ created_at }) => new Date(created_at).toISOString().split('T')[1]);
      const sorted = Object.keys(t).toSorted((a, b) =>
        new Date(`2024-01-01T${a}`) > new Date(`2024-01-01T${b}`) ? 1 : -1
      );
      setBatchTimes(sorted);
      setBatchTime(sorted.at(-1) || '');
      // setTimes(t);
    }
  }, [batchDate, dates]);

  useEffect(() => {
    if (batchTime) {
      const batchID = batches.find(
        (batch) =>
          new Date(batch.created_at).toISOString() ===
          new Date(`${batchMonth} ${batchDate} ${batchYear} ${batchTime}`).toISOString()
      )?.id;
      if (batchID) {
        setBatchID(batchID);
      }
    }
  }, [batchDate, batchMonth, batchTime, batchYear, batches]);

  useEffect(() => {
    if (isLoading) {
      getBatch();
    }
  }, [getBatch, isLoading]);

  return (
    <div>
      <div className={styles.filters}>
        <fieldset className={styles.fieldset}>
          <legend>Batch</legend>
          <div className={styles.fieldsetInputs}>
            <Select label="Year" value={batchYear} onChange={(e) => setBatchYear(e.target.value)} inline>
              {batchYears.toReversed().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
            <Select label="Month" value={batchMonth} onChange={(e) => setBatchMonth(e.target.value)} inline>
              {batchMonths.toReversed().map((month) => (
                <option key={month} value={month}>
                  {new Date(`2024-${month}-1`).toLocaleDateString(undefined, { month: 'long' })}
                </option>
              ))}
            </Select>
            <Select label="Day" value={batchDate} onChange={(e) => setBatchDate(e.target.value)} inline>
              {batchDates.toReversed().map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </Select>
            <Select label="Time" value={batchTime} onChange={(e) => setBatchTime(e.target.value)} inline>
              {batchTimes.toReversed().map((time) => (
                <option key={time} value={time}>
                  {new Date(`2024-01-01T${time}`).toLocaleTimeString(undefined, {
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </option>
              ))}
            </Select>
          </div>
        </fieldset>
        <button type="button" className={styles.applyFilters} onClick={getBatch}>
          Apply
        </button>
        {/* <div className={styles.or}>or</div>
        <fieldset className={styles.fieldset}>
          <legend className="visually-hidden">Date range</legend>
          <div className={styles.fieldsetInputs}>
            <label className="form-control">
              <span className="form-control-label text-subtle">From</span>
              <input
                type="date"
                className="form-control-input"
                min={toISODateString(batches.at(-1)?.created_at || '')}
                max={toISODateString(batches.at(0)?.created_at || '')}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </label>
            <label className="form-control">
              <span className="form-control-label text-subtle">To</span>
              <input
                type="date"
                className="form-control-input"
                min={toISODateString(batches.at(-1)?.created_at || '')}
                max={toISODateString(batches.at(0)?.created_at || '')}
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </label>
          </div>
        </fieldset>
        <button type="button" className={styles.applyFilters} onClick={() => updateReports(from, to)}>
          Apply
        </button> */}
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
                    {report.urls && <td>{new URL(report.urls.url).pathname}</td>}
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
              {reports.length === 0 && (
                <tr>
                  <td colSpan={5}>No results for the applied filters</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
