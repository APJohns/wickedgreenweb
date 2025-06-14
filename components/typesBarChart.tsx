'use client';

import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import styles from './typeSizesChart.module.css';
import { formatBytes } from '@/utils/utils';

interface Data {
  bytes: number;
  type: string;
}

interface Props {
  data: Data[];
  className?: string;
}

export default function TypesBarChart({ data, className }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [w, setWidth] = useState(600);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = '';
    }

    const margin = { top: 0, right: 10, bottom: 40, left: 60 };
    const width = w - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    let scale = 1;
    let unit = 'bytes';

    const maxValue = Math.max(...Array.from(data, (d) => d.bytes));
    if (maxValue >= 900000) {
      scale = 1000000;
      unit = 'Mbs';
    } else if (maxValue >= 900) {
      scale = 1000;
      unit = 'Kbs';
    }

    const asKb = data.map((d) => ({
      ...d,
      bytes: d.bytes / scale,
    }));

    const svg = d3
      .select(ref.current)
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr('preserveAspectRatio', 'xMinyMid')
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const justBytes = Array.from(asKb, (d) => d.bytes);
    const justTypes = Array.from(asKb, (d) => d.type);

    const x = d3
      .scaleLinear()
      .domain([0, Math.max(...justBytes)])
      .range([0, width])
      .nice();

    const y = d3.scaleBand().domain(justTypes).range([0, height]);

    svg
      .append('g')
      .attr('class', 'subtle-ticks')
      .attr('transform', `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(width / 40)
          .tickFormat(d3.format(','))
      );

    svg.append('g').call(d3.axisLeft(y).tickSizeInner(0).tickPadding(8)).select('.domain').remove();

    svg
      .selectAll('.bar')
      .data(asKb)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', x(0))
      .attr('y', (d) => y(d.type)! + y.bandwidth() / 2 - 8)
      .attr('width', (d) => x(d.bytes))
      .attr('height', 16)
      .attr('rx', 8)
      .attr('ry', 8)
      .attr('fill', '#5bc871');

    svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height})`)
      .attr('class', 'axis-label')
      .append('text')
      .attr('dy', 36)
      .attr('class', styles.axisLabel)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .text(`Weight (${unit})`);
  }, [data, w]);

  useEffect(() => {
    const resizeChart = () => {
      if (containerRef.current) {
        setWidth(containerRef.current?.clientWidth);
      }
    };

    resizeChart();

    window.addEventListener('resize', resizeChart);
    return () => {
      window.removeEventListener('resize', resizeChart);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.barChartContainer + ' ' + className}>
      <svg ref={ref} className={styles.barChart} aria-hidden="true" />
      <dl className="visually-hidden">
        {data.map((d) => {
          const formattedBytes = formatBytes(d.bytes);
          return (
            <>
              <dt>{d.type}</dt>
              <dd>
                {formattedBytes.value} {formattedBytes.unit}
              </dd>
            </>
          );
        })}
      </dl>
    </div>
  );
}
