import React, { useEffect, useState } from 'react';

import { Box, Card, Title, Text } from '@mantine/core';
import { Datum } from '@nivo/calendar';
import { useIntl } from 'react-intl';

import { Calendar } from 'components';
import { TransactionModel, TransactionTable } from 'features/transactions';
import { useAnalyticsStore } from 'store';

export function Activity() {
  const { getTransactionsCount, transactionsCount, getTransactionsForDay } = useAnalyticsStore();
  const { formatMessage } = useIntl();

  const [transactions, setTransactions] = useState<TransactionModel[]>([]);

  useEffect(() => {
    getTransactionsCount();
  }, []);

  const dayClickHandler = async (day: Datum | Omit<Datum, 'value' | 'data'>) => {
    const { date } = day;
    const timezoneOffsetInMs = date.getTimezoneOffset() * 60 * 1000;
    const isoString = new Date(date.getTime() - timezoneOffsetInMs).toISOString();
    console.log(day.date, isoString, transactions);

    // TODO: Date when to ISO, changes the date

    const txns = await getTransactionsForDay(isoString);
    setTransactions(txns);
  };

  return (
    <Box my="sm" w="100%">
      <Card withBorder radius="lg" p="md">
        <Title order={2}>
          {formatMessage({ id: 'dsh-activity' }, { year: new Date().getFullYear() })}
        </Title>
        <Text c="dimmed" size="md">
          *{' '}
          {formatMessage({
            id: transactionsCount.length === 0 ? 'dsh-activity-no-data' : 'dsh-activity-help'
          })}
        </Text>

        <Calendar transactionsCount={transactionsCount} onDayClick={dayClickHandler} />
        {transactions.length > 0 && <TransactionTable transactions={transactions} />}
      </Card>
    </Box>
  );
}
