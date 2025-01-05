'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SWDMV4_PERCENTILES, SWDMV4_RATINGS } from '@/utils/constants';
import { CO2Point } from './co2Chart';

interface LineChartProps {
  data: CO2Point[];
}

export default function Chart(props: LineChartProps): JSX.Element {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(928);
  const [height, setHeight] = useState(232);

  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.innerHTML = '';
    }
    // const height = width / 4 >= 32 ? width / 4 : 32;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 40;
    const marginLeft = 40;

    // Declare the x (horizontal position) scale.
    const x = d3
      .scaleTime(d3.extent(props.data, (d) => new Date(d.date)) as [Date, Date], [marginLeft, width - marginRight])
      .nice();

    // Declare the y (vertical position) scale.
    const yExtent = d3.extent(props.data, (d) => d.co2) as [number, number];
    let next = yExtent[1];
    for (const percentile in SWDMV4_PERCENTILES) {
      const p = SWDMV4_PERCENTILES[percentile as keyof typeof SWDMV4_PERCENTILES];
      if (p - next > 0) {
        next = p;
        break;
      }
    }

    const y = d3.scaleLinear([0, next], [height - marginBottom, marginTop]).nice();

    // Declare the line generator.
    const line = d3
      .line<CO2Point>()
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.co2));

    const svg = d3.select(svgRef.current).attr('viewBox', [0, 0, width, height]);

    // Add the x-axis.
    svg
      .append('g')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(width / 120)
          // .ticks(d3.timeDay.every(1))
          .tickSizeOuter(0)
      );

    // Add the y-axis, remove the domain line, add grid lines and a label.
    svg
      .append('g')
      .attr('transform', `translate(${marginLeft},0)`)
      .call(
        d3
          .axisLeft(y)
          .ticks(height / 40)
          .tickFormat(d3.format('.2f'))
      )
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .selectAll('.tick line')
          .attr('x2', width - marginLeft - marginRight)
          .attr('stroke-opacity', 0.1)
      );

    for (const percentile in SWDMV4_PERCENTILES) {
      const p = SWDMV4_PERCENTILES[percentile as keyof typeof SWDMV4_PERCENTILES];
      if (next >= p) {
        svg
          .append('line')
          .attr('class', 'percentile ' + percentile.toLowerCase())
          .attr('x1', marginLeft)
          .attr('y1', y(p))
          .attr('x2', width - marginRight)
          .attr('y2', y(p));
        svg
          .append('text')
          .attr('class', 'percentile-label')
          .attr('x', width - marginLeft)
          .attr('y', y(p))
          .attr('dy', '1em')
          .attr('fill', 'currentColor')
          .text(SWDMV4_RATINGS[percentile as keyof typeof SWDMV4_RATINGS]);
      }
    }

    if (next > SWDMV4_PERCENTILES.FIFTIETH_PERCENTILE) {
      svg
        .append('text')
        .attr('class', 'percentile-label')
        .attr('x', width - marginLeft)
        .attr('y', y(SWDMV4_PERCENTILES.FIFTIETH_PERCENTILE))
        .attr('dy', '-0.5em')
        .attr('fill', 'currentColor')
        .text('F');
    }

    // Append a path for the line.
    svg
      .append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke-linejoin', 'round')
      .attr('d', line(props.data));

    // Append points
    /* svg
      .selectAll('points')
      .data(props.data)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', (d) => x(new Date(d.date)))
      .attr('cy', (d) => y(d.co2))
      .attr('r', 3); */
  }, [props.data, width, height]);

  useEffect(() => {
    const resizeChart = () => {
      if (containerRef.current) {
        setWidth(containerRef.current?.clientWidth);
        setHeight(containerRef.current?.clientHeight);
      }
    };

    resizeChart();

    window.addEventListener('resize', resizeChart);
    return () => {
      window.removeEventListener('resize', resizeChart);
    };
  }, []);

  return (
    <div ref={containerRef} className="chart-container">
      <svg ref={svgRef} className="chart" />
    </div>
  );
}
