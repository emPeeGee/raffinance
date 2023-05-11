import React, { useEffect, useMemo } from 'react';

import { useMantineTheme } from '@mantine/core';
import { useIntl } from 'react-intl';

import { LineDateChart } from 'components';
import { useAnalyticsStore } from 'store';

export function BalanceEvo() {
  const { getBalanceEvo, balanceEvo } = useAnalyticsStore();
  const theme = useMantineTheme();
  const { formatMessage, formatNumber } = useIntl();

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
      title={formatMessage(
        { id: 'dsh-bal-evo' },
        { currency: 'MDL', balance: formatNumber(150000) }
      )}
      enableArea
      colors={[theme.colors.blue[6]]}
    />
  );
}
