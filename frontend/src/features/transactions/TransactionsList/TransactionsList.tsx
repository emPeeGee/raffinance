import React, { useState } from 'react';

import {
  Accordion,
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Table,
  TextInput,
  useMantineTheme
} from '@mantine/core';
import { MonthPicker } from '@mantine/dates';
import { IconArrowLeft, IconArrowRight, IconFilter, IconSearch } from '@tabler/icons-react';
import { FormattedDate, useIntl } from 'react-intl';

import { MultiPicker, ViewSwitcher } from 'components';
import {
  NoTransactions,
  TransactionCard,
  TransactionModel,
  TransactionsFilter
} from 'features/transactions';
import { useCategoriesStore, useTagsStore, useTransactionStore } from 'store';
import { getContrastColor } from 'utils';

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

          {viewMode === 'card' && (
            <SimpleGrid
              cols={4}
              my="lg"
              breakpoints={[
                { maxWidth: 'md', cols: 2 },
                { maxWidth: 'xs', cols: 1 }
              ]}>
              {transactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  currency={currency}
                />
              ))}
            </SimpleGrid>
          )}

          {/* TODO: Table is not looking good */}
          {viewMode === 'table' && (
            <div>
              <Paper withBorder radius="md">
                <Table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      {/* TODO: type as transaction text */}
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(transactions ?? []).map(
                      ({
                        id: txnId,
                        transactionTypeId,
                        amount,
                        description,
                        category,
                        tags,
                        date
                      }) => (
                        <tr key={txnId}>
                          <td>
                            <FormattedDate value={date} dateStyle="short" timeStyle="short" />
                          </td>
                          <td>{transactionTypeId}</td>
                          <td>{description}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <div
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  backgroundColor: category.color,
                                  marginRight: '8px'
                                }}
                              />

                              <Group mb="xs">
                                <Badge c={category.color}>{category.name}</Badge>
                              </Group>
                            </div>
                          </td>
                          <td>{amount}</td>
                          <td>
                            {tags?.map((tag) => (
                              <Badge
                                key={tag.id}
                                mr="xs"
                                bg={tag.color}
                                c={getContrastColor(tag.color)}
                                variant="filled">
                                {tag.name}
                              </Badge>
                            ))}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </Table>
              </Paper>
            </div>
          )}
        </>
      )}
    </div>
  );
}
