'use client';

import Chart from '@/app/dashboard/projects/[id]/chart';
import { useState } from 'react';

export interface CO2Point {
  co2: number;
  date: string | Date;
}

export default function CO2Chart({ data }: { data: CO2Point[] }) {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className={`chart-card${showOverlay ? ' overlay' : ''}`}>
      <h2 className="chart-card-heading">Emissions over time</h2>
      <Chart data={data} />
      <label className="form-control-inline">
        <input type="checkbox" onChange={() => setShowOverlay(!showOverlay)} />
        Show rating overlay
      </label>
    </div>
  );
}
