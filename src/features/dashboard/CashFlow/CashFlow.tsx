/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useMemo } from 'react';

import { LineDateChart } from 'components';
import { useAnalyticsStore } from 'store';

export function CashFlow() {
  const { getCashFlow, cashFlow } = useAnalyticsStore();

  const data = useMemo(
    () => [
      {
        data: cashFlow.map((day) => ({ x: new Date(day.date), y: day.income, color: 'blue' })),
        id: 'Income'
      },
      {
        data: cashFlow.map((day) => ({ x: new Date(day.date), y: 0 - day.expense })),
        id: 'Expense'
      },
      {
        data: cashFlow.map((day) => ({ x: new Date(day.date), y: day.cashFlow })),
        id: 'Flow',
        disableArea: true
      }
    ],
    [cashFlow]
  );

  useEffect(() => {
    getCashFlow();
  }, []);

  return (
    <LineDateChart
      data={data}
      height={400}
      title="Cashflow 150,000 MDL"
      enableArea
      colors={['rgb(97, 205, 187)', 'rgb(244, 117, 96)', 'rgb(243, 186, 73)']}
    />
  );
}
