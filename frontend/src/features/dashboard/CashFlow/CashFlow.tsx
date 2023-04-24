/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect } from 'react';

import { Bar, ResponsiveBar } from '@nivo/bar';
import { line } from 'd3-shape';

import { LineDateChart, LineNumberChart } from 'components';
import { useAnalyticsStore } from 'store';

const lineColor = 'rgba(200, 30, 15, 1)';

function Line({ bars, xScale, yScale }: any) {
  const lineGenerator = line()
    .x((bar: any) => xScale(bar.data.index) + bar.width / 2)
    .y((bar: any) => yScale(bar.data.data.v1));

  return (
    <>
      <path
        d={lineGenerator(bars) as any}
        fill="none"
        stroke={lineColor}
        style={{ pointerEvents: 'none' }}
      />
      {bars.map((bar: any) => (
        <circle
          key={bar.key}
          cx={xScale(bar.data.indexValue) + bar.width / 2}
          cy={yScale(bar.data.data.v1)}
          r={4}
          fill="white"
          stroke={lineColor}
          style={{ pointerEvents: 'none' }}
        />
      ))}
    </>
  );
}

const divergingCommonProps = {
  indexBy: 'date',
  enableGridX: true,
  enableGridY: false,
  valueFormat: (value: number) => `${Math.abs(value)}`,
  labelTextColor: 'inherit:darker(1.2)',
  axisTop: {
    tickSize: 0,
    tickPadding: 12
  },
  axisBottom: {
    legend: 'USERS',
    legendPosition: 'middle' as const,
    legendOffset: 50,
    tickSize: 0,
    tickPadding: 12
  },
  margin: { bottom: 30, top: 50 },
  axisLeft: null,
  axisRight: {
    format: (v: number) => `${Math.abs(v)}%`
  },
  markers: [
    {
      axis: 'y',
      value: 0,
      lineStyle: { strokeOpacity: 0 },
      textStyle: { fill: '#2ebca6' },
      legend: 'income',
      legendPosition: 'top-left',
      legendOrientation: 'vertical',
      legendOffsetY: 30
    } as const,
    {
      axis: 'y',
      value: 0,
      lineStyle: { stroke: '#f47560', strokeWidth: 1 },
      textStyle: { fill: '#e25c3b' },
      legend: 'expense',
      legendPosition: 'bottom-left',
      legendOrientation: 'vertical',
      legendOffsetY: 30
    } as const
  ]
};

function Appp({ data }: any) {
  console.log('app', data);
  return <ResponsiveBar {...divergingCommonProps} keys={['income', 'expense']} data={data} />;
}

export function CashFlow() {
  const { getCashFlow, cashFlow } = useAnalyticsStore();

  const data2 = cashFlow.map((day) => ({ ...day, x: new Date(day.date), expense: -day.expense }));

  const data = [
    {
      data: cashFlow.map((day) => ({ x: new Date(day.date), y: day.income })),
      id: 'Income'
    },
    {
      data: cashFlow.map((day) => ({ x: new Date(day.date), y: 0 - day.expense })),
      id: 'Expense'
    },

    {
      data: cashFlow.map((day) => ({ x: new Date(day.date), y: day.cashFlow })),
      id: 'Flow'
    }
  ];

  console.log('cash', data);

  useEffect(() => {
    getCashFlow();
  }, []);

  return (
    <>
      <div style={{ height: 400 }}>
        <Appp data={data2} />
      </div>

      <LineDateChart
        data={data}
        height={400}
        title="Balance evolution 150,000 MDL"
        enableArea={false}
        colors={['rgb(97, 205, 187)', 'rgb(244, 117, 96)', '#000000']}
      />
    </>
  );
}
