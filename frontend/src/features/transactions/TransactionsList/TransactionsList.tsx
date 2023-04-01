import React, { useMemo, useState } from 'react';

import {
  Accordion,
  ActionIcon,
  Button,
  Group,
  SimpleGrid,
  TextInput,
  Title,
  useMantineTheme
} from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconSearch } from '@tabler/icons-react';
import { FormattedDate, useIntl } from 'react-intl';

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

  const gotoTransaction = (txnId: number) => () => {};
  const { viewMode, setViewMode } = useTransactionStore();

  const toggleTransactions = () => setShowTransactions((show) => !show);

  // TODO: util func
  const isEmpty = transactions.length === 0;

  if (isEmpty) {
    return <NoTransactions />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const agregatedTxns = useMemo(() => {
    return groupTransactionsByDay(transactions);
  }, [transactions]);

  console.log(agregatedTxns);

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

      {showTransactions && (
        <>
          {/* TODO: Make a generic view switcher */}
          <ViewSwitcher defaultValue={viewMode} onChange={setViewMode} />

          <Accordion multiple variant="separated" defaultValue={Object.keys(agregatedTxns)}>
            {Object.keys(agregatedTxns).map((groupDate) => (
              <Accordion.Item value={groupDate} key={groupDate}>
                <Accordion.Control>
                  <Group position="apart" align="center">
                    <Title order={3}>
                      <FormattedDate dateStyle="full" value={groupDate} />
                    </Title>

                    <Title order={3} color="dimmed">
                      {agregatedTxns[groupDate].amount} CUR
                    </Title>
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
                      {agregatedTxns[groupDate].transactions.map((transaction) => (
                        <TransactionCard
                          key={transaction.id}
                          transaction={transaction}
                          currency={currency}
                        />
                      ))}
                    </SimpleGrid>
                  )}

                  {viewMode === 'table' && (
                    <TransactionTable transactions={agregatedTxns[groupDate].transactions} />
                  )}
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </>
      )}
    </div>
  );
}
