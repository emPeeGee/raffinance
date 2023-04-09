import React, { useEffect, useState } from 'react';

import { Alert, Button, Group, Text, Title, createStyles, rem } from '@mantine/core';
import { IconCircle, IconInfoCircle } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  TransactionFilterModel,
  TransactionsFilter,
  TransactionsList
} from 'features/transactions';
import { useTransactionStore } from 'store';
import { getDateRangeText } from 'utils';

// import { useTransactionStore } from 'store';

// TODO: Breadcrumbs ???

const useStyles = createStyles((theme) => ({
  title: {
    fontWeight: 900,
    fontSize: rem(34),
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32)
    }
  }
}));

export function TransactionsDashboard() {
  const { formatMessage } = useIntl();
  const { classes } = useStyles();
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);

  const { transactions, getTransactions, pending, fetchTransactions } = useTransactionStore();

  useEffect(() => {
    getTransactions();
  }, []);

  const applyFiltersHandler = (filters: TransactionFilterModel) => {
    setRange(filters.dateRange);
    fetchTransactions(filters);
  };

  const clearAllHandler = () => {
    setRange([null, null]);
    fetchTransactions();
  };

  return (
    <>
      <Group position="apart" mb="md">
        <Title className={classes.title}>
          {formatMessage({ id: 'txn' })}
          <Text inline color="blue">
            {getDateRangeText(range, formatMessage)}
          </Text>
        </Title>
        <Button
          component={Link}
          to="/transactions/create"
          variant="light"
          color="cyan"
          leftIcon={<IconCircle />}>
          {formatMessage({ id: 'txn-create' })}
        </Button>
      </Group>

      <Alert icon={<IconInfoCircle size="1rem" />} color="gray" my="lg">
        {formatMessage({ id: 'txn-info' })}
      </Alert>

      <TransactionsFilter onApply={applyFiltersHandler} onClear={clearAllHandler} withAccount />
      <TransactionsList transactions={transactions} pending={pending} />
    </>
  );
}
