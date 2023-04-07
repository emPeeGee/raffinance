import React, { useEffect } from 'react';

import {
  Button,
  Container,
  Group,
  Title,
  createStyles,
  rem,
  Blockquote,
  Alert
} from '@mantine/core';
import { IconCircle, IconHeartPlus, IconInfoCircle } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { TransactionsList, NoTransactions } from 'features/transactions';
import { useTransactionStore } from 'store';

// import { useTransactionStore } from 'store';

// TODO: Breadcrumbs ???

const useStyles = createStyles((theme) => ({
  title: {
    fontWeight: 900,
    fontSize: rem(34),
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32)
    }
  }
}));

export function TransactionsDashboard() {
  const { formatMessage } = useIntl();
  const { classes } = useStyles();

  const { transactions, getTransactions } = useTransactionStore();

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <>
      <Group position="apart" py="sm">
        <Title className={classes.title}>{formatMessage({ id: 'txn' })}</Title>
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
      <Group>{/* <TransactionViewSwitcher /> */}</Group>

      <TransactionsList transactions={transactions} currency="aa" />
    </>
  );
}
