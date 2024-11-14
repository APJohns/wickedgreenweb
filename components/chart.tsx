'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Averages {
  date: string;
  co2: number;
}

interface LineChartProps {
  data: Averages[];
}

export default function Chart(props: LineChartProps): JSX.Element {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(928);

  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.innerHTML = '';
    }
    const height = width / 4 >= 32 ? width / 4 : 32;
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
    const y = d3.scaleLinear([0, yExtent[1] + 0.01], [height - marginBottom, marginTop]).nice();

    // Declare the line generator.
    const line = d3
      .line<Averages>()
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.co2));

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Add the x-axis.
    svg
      .append('g')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .call(
        d3
          .axisBottom(x)
          // .ticks(width / 80)
          .ticks(d3.timeDay.every(1))
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
          .clone()
          .attr('x2', width - marginLeft - marginRight)
          .attr('stroke-opacity', 0.1)
      );
    /* .call((g) =>
        g
          .append('text')
          .attr('x', -marginLeft)
          .attr('y', 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text('↑ Daily close ($)')
      ); */

    // Append a path for the line.
    svg.append('path').attr('class', 'line').attr('fill', 'none').attr('stroke-width', 1.5).attr('d', line(props.data));

    // Append points
    svg
      .selectAll('points')
      .data(props.data)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('stroke-width', 1.5)
      .attr('cx', (d) => x(new Date(d.date)))
      .attr('cy', (d) => y(d.co2))
      .attr('r', 3);
  }, [props.data, width]);

  useEffect(() => {
    const resizeChart = () => {
      if (containerRef.current?.clientWidth) {
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
    <div ref={containerRef} className="docs-chart-container">
      <svg ref={svgRef} className="docs-spark-chart" />
    </div>
  );
}
