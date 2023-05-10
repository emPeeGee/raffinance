import React, { useEffect, useMemo } from 'react';

import { useMantineTheme } from '@mantine/core';

import { LineDateChart } from 'components';
import { useAnalyticsStore } from 'store';

export function BalanceEvo() {
  const { getBalanceEvo, balanceEvo } = useAnalyticsStore();
  const theme = useMantineTheme();

  const data = useMemo(
    () => [
      {
        data: balanceEvo.map((day) => ({ x: new Date(day.date), y: day.value })),
        id: 'Balance'
      }
    ],
    [balanceEvo]
  );

  useEffect(() => {
    getBalanceEvo();
  }, []);

  return (
    <LineDateChart
      data={data}
      height={400}
      title="Balance evolution 150,000 MDL"
      enableArea
      colors={[theme.colors.blue[6]]}
    />
  );
}
