import React, { useMemo } from 'react';

import { Accordion, Group, Loader, SimpleGrid, Text, Title } from '@mantine/core';
import { FormattedDate, FormattedNumber, useIntl } from 'react-intl';

import { ViewSwitcher } from 'components';
import {
  NoTransactions,
  TransactionCard,
  TransactionModel,
  TransactionTable,
  TransactionType,
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
  const { viewMode, setViewMode, pending } = useTransactionStore();

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
                  mt="lg"
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

      {pending ? (
        <Group position="center" p="lg">
          <Loader />
        </Group>
      ) : (
        content
      )}
    </div>
  );
}
