import React from 'react';

import { createStyles, rem, Title, Group, Text, Paper, UnstyledButton, Badge } from '@mantine/core';
import {
  IconArrowNarrowRight,
  IconArrowsExchange,
  IconCashBanknote,
  IconCashBanknoteOff
} from '@tabler/icons-react';
import { FormattedDate } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { TransactionType } from 'features/accounts';
import { Transaction } from 'features/transactions';
import { getContrastColor } from 'utils';

const useStyles = createStyles((theme) => ({
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
  transaction: Transaction;
  currency: string;
}

export function TransactionCard({ transaction, currency }: Props) {
  const { id, category, tags, amount, date, description, transactionTypeId } = transaction;
  const { classes } = useStyles();
  const navigate = useNavigate();

  const gotoTransaction = () => {
    navigate(`/transactions/${id}`);
  };

  return (
    <div>
      <Paper withBorder p="md" radius="md" key={`${description}${date}`}>
        <Group mb="xs" spacing={0}>
          <Badge c={category.color}>{category.name}</Badge>
        </Group>
        <UnstyledButton onClick={gotoTransaction}>
          <Group position="apart">
            <Title order={5} mb="sm" className={classes.transactionTitle}>
              {description}
            </Title>
          </Group>

          <Group align="center" mb="xs" spacing="0.25rem">
            {transactionTypeId === TransactionType.INCOME && (
              <>
                <IconCashBanknote color="green" size="2rem" />
                <Text className={classes.value} color="green">
                  {amount}
                </Text>
              </>
            )}

            {transactionTypeId === TransactionType.EXPENSE && (
              <>
                <IconCashBanknoteOff color="red" size="2rem" />
                <Text className={classes.value} color="red">
                  {amount}
                </Text>
              </>
            )}

            {transactionTypeId === TransactionType.TRANSFER && (
              <>
                <IconArrowsExchange color="violet" size="2rem" />

                <Text className={classes.value} color="violet">
                  {amount}
                </Text>
              </>
            )}

            <Text className={classes.currency} size="sm" fw={500}>
              {currency}
            </Text>
          </Group>

          <Group mb="sm">
            <Text color="dimmed">
              <FormattedDate value={date} dateStyle="short" timeStyle="short" />
            </Text>
          </Group>

          <Group mb="xs">
            {tags.map((tag) => (
              <Badge key={tag.id} bg={tag.color} c={getContrastColor(tag.color)} variant="filled">
                {tag.name}
              </Badge>
            ))}
          </Group>

          {transactionTypeId === TransactionType.TRANSFER && (
            <Group spacing="0rem">
              {/* TODO: real names */}
              <Badge c={category.color}>from</Badge>
              <IconArrowNarrowRight />
              <Badge c={category.color}>to</Badge>
            </Group>
          )}
        </UnstyledButton>
      </Paper>
    </div>
  );
}
