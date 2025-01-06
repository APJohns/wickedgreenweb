'use client';

import Chart from '@/app/dashboard/projects/[id]/chart';

export interface CO2Point {
  co2: number;
  date: string | Date;
}

export default function CO2Chart({ data }: { data: CO2Point[] }) {
  return (
    <div className="chart-card">
      <h2 className="chart-card-heading">Emissions over time</h2>
      <Chart data={data} />
    </div>
  );
}
