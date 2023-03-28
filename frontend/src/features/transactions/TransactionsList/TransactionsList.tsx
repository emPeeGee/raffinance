import React, { useState } from 'react';

import {
  Button,
  Card,
  createStyles,
  rem,
  Title,
  Group,
  Text,
  Paper,
  SimpleGrid,
  Table,
  SegmentedControl,
  UnstyledButton,
  Badge
} from '@mantine/core';
import { MonthPicker } from '@mantine/dates';
import {
  IconArrowBigRight,
  IconArrowNarrowRight,
  IconArrowsExchange,
  IconCashBanknote,
  IconCashBanknoteOff,
  IconMinus,
  IconPlus,
  IconReplace
} from '@tabler/icons-react';
import { FormattedDate, useIntl } from 'react-intl';

import { TransactionType, AccountViewSwitcher, ViewMode } from 'features/accounts';
import { NoTransactions, Transaction, TransactionCard } from 'features/transactions';
import { getContrastColor } from 'utils';

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5]
  },

  transactionTitle: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32)
    }
  },

  value: {
    fontSize: rem(28),
    fontWeight: 700,
    lineHeight: 1
  },
  currency: {
    fontSize: rem(24),
    fontWeight: 700,
    lineHeight: 1
  }
}));

interface Props {
  transactions: Transaction[];
  viewMode: ViewMode;
  currency: string;
}

export function TransactionsList({ transactions, viewMode, currency }: Props) {
  const { formatMessage } = useIntl();
  const { classes } = useStyles();
  const [month, setMonth] = useState<Date | null>(null);

  const [showTransactions, setShowTransactions] = useState(true);

  const gotoTransaction = (txnId: number) => () => {};

  const toggleTransactions = () => setShowTransactions((show) => !show);

  // TODO: util func
  const isEmpty = transactions.length === 0;

  if (isEmpty) {
    return <NoTransactions />;
  }

  return (
    <div>
      <Card my="lg" withBorder radius="md">
        <Group position="apart" mb="md">
          <SegmentedControl
            value="all"
            // onChange={(value: ViewMode) => setViewMode(value)}
            data={[
              { label: formatMessage({ id: 'co-all' }), value: 'all' },
              { label: formatMessage({ id: 'co-income' }), value: 'table' },
              { label: formatMessage({ id: 'co-expense' }), value: 'ex' },
              { label: formatMessage({ id: 'co-transfers' }), value: 'card' }
            ]}
          />

          <Button variant="light" onClick={toggleTransactions}>
            {showTransactions ? 'Hide transactions' : 'Show transactions'}
          </Button>
        </Group>

        <Group position="center">
          {/* TODO: Move from this component, because it require backend call */}
          <MonthPicker
            value={month}
            onChange={setMonth}
            defaultDate={new Date()}
            minDate={new Date(1910, 1, 1)}
            maxDate={new Date()}
          />
        </Group>
      </Card>

      {showTransactions && (
        <>
          {/* TODO: Make a generic view switcher */}
          <AccountViewSwitcher />
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
                            {tags.map((tag) => (
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