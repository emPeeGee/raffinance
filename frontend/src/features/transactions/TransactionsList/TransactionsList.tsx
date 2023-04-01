import React, { useMemo, useState } from 'react';

import {
  Accordion,
  ActionIcon,
  Button,
  Group,
  Loader,
  SimpleGrid,
  Text,
  TextInput,
  Title,
  useMantineTheme
} from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconSearch } from '@tabler/icons-react';
import { FormattedDate, FormattedNumber, useIntl } from 'react-intl';

import { ViewSwitcher } from 'components';
import { TransactionType } from 'features/accounts';
import {
  NoTransactions,
  TransactionCard,
  TransactionModel,
  TransactionTable,
  TransactionsFilter
} from 'features/transactions';
import { useTransactionStore } from 'store';

interface GroupedTransaction {
  amount: number;
  transactions: TransactionModel[];
}

function groupTransactionsByDay(transactions: TransactionModel[]): {
  [key: string]: GroupedTransaction;
} {
  return transactions.reduce(
    (acc: { [key: string]: GroupedTransaction }, transaction: TransactionModel) => {
      const date: string = new Date(transaction.date).toISOString().slice(0, 10);
      const existingGroup: GroupedTransaction = acc[date] || { amount: 0, transactions: [] };

      switch (transaction.transactionTypeId) {
        case TransactionType.INCOME:
          existingGroup.amount += transaction.amount;
          break;

        case TransactionType.EXPENSE:
          existingGroup.amount -= transaction.amount;
          break;
        default:
          break;
      }
      existingGroup.transactions.push({ ...transaction });
      acc[date] = existingGroup;

      return acc;
    },
    {}
  );
}

interface Props {
  transactions: TransactionModel[];
  currency: string;
}

export function TransactionsList({ transactions, currency }: Props) {
  const { formatMessage } = useIntl();
  const theme = useMantineTheme();
  const [showTransactions, setShowTransactions] = useState(true);
  const { viewMode, setViewMode, pending } = useTransactionStore();

  const toggleTransactions = () => setShowTransactions((show) => !show);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const aggregatedTxns = useMemo(() => {
    return groupTransactionsByDay(transactions);
  }, [transactions]);

  // TODO: util func
  const isEmpty = Object.keys(aggregatedTxns).length === 0;

  const content = isEmpty ? (
    <NoTransactions />
  ) : (
    <>
      <ViewSwitcher defaultValue={viewMode} onChange={setViewMode} />

      <Accordion multiple variant="separated" defaultValue={Object.keys(aggregatedTxns)}>
        {Object.keys(aggregatedTxns).map((groupDate) => (
          <Accordion.Item value={groupDate} key={groupDate}>
            <Accordion.Control>
              <Group position="apart" align="center">
                <Title order={3}>
                  <FormattedDate dateStyle="full" value={groupDate} />
                </Title>

                <Group>
                  <Text color="dimmed">
                    {aggregatedTxns[groupDate].transactions.length}{' '}
                    {formatMessage({ id: 'txn' }).toLocaleLowerCase()}
                  </Text>
                  <Title order={3} color="dimmed" w={150} align="right">
                    <FormattedNumber
                      currencyDisplay="code"
                      value={aggregatedTxns[groupDate].amount}
                    />{' '}
                    CUR
                  </Title>
                </Group>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              {viewMode === 'card' && (
                <SimpleGrid
                  cols={4}
                  my="lg"
                  breakpoints={[
                    { maxWidth: 'md', cols: 2 },
                    { maxWidth: 'xs', cols: 1 }
                  ]}>
                  {aggregatedTxns[groupDate].transactions.map((transaction) => (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                      currency={currency}
                    />
                  ))}
                </SimpleGrid>
              )}

              {viewMode === 'table' && (
                <TransactionTable transactions={aggregatedTxns[groupDate].transactions} />
              )}
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  );

  return (
    <div>
      <TransactionsFilter />

      <Button variant="light" onClick={toggleTransactions} mb="md">
        {formatMessage({ id: showTransactions ? 'txn-hide' : 'txn-show' })}
      </Button>

      <TextInput
        icon={<IconSearch size="1.1rem" stroke={1.5} />}
        radius="xl"
        size="md"
        mb="md"
        rightSection={
          <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled">
            {theme.dir === 'ltr' ? (
              <IconArrowRight size="1.1rem" stroke={1.5} />
            ) : (
              <IconArrowLeft size="1.1rem" stroke={1.5} />
            )}
          </ActionIcon>
        }
        placeholder={formatMessage({ id: 'txn-search' })}
        rightSectionWidth={42}
      />

      {pending ? (
        <Group position="center" p="lg">
          <Loader />
        </Group>
      ) : (
        showTransactions && content
      )}
    </div>
  );
}
