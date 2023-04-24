import React, { useEffect } from 'react';

import { LineDateChart } from 'components';
import { useAnalyticsStore } from 'store';

export function BalanceEvo() {
  const { getBalanceEvo, balanceEvo } = useAnalyticsStore();

  const data = [
    {
      data: balanceEvo.map((day) => ({ x: new Date(day.date), y: day.value })),
      id: 'Balance'
    }
  ];

  useEffect(() => {
    getBalanceEvo();
  }, []);

  return <LineDateChart data={data} height={400} title="Balance evolution 150,000 MDL" />;
}
