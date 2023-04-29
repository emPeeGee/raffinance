import React, { useEffect } from 'react';

import { Box, Paper, Title } from '@mantine/core';
import { useIntl } from 'react-intl';

import { Calendar } from 'components';
import { useAnalyticsStore } from 'store';

export function Activity() {
  const { getTransactionsCount, transactionsCount } = useAnalyticsStore();
  const { formatMessage } = useIntl();

  useEffect(() => {
    getTransactionsCount();
  }, []);

  return (
    <Box my="sm" w="100%">
      <Paper withBorder radius="lg" p="md">
        <Title order={2}>
          {formatMessage({ id: 'dsh-activity' }, { year: new Date().getFullYear() })}
        </Title>

        <Calendar transactionsCount={transactionsCount} />
      </Paper>
    </Box>
  );
}
