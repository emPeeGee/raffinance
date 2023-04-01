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

import { TransactionModel, TransactionType } from 'features/transactions';
import { useAccountStore } from 'store';
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
  transaction: TransactionModel;
  currency: string;
}

export function TransactionCard({ transaction, currency }: Props) {
  const { id, category, tags, amount, date, description, transactionTypeId } = transaction;
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { accounts } = useAccountStore();

  const gotoTransaction = () => {
    navigate(`/transactions/${id}`);
  };

  // TODO: How performant is it ???
  const txnAcc = accounts.find((a) => a.id === transaction.toAccountId);

  return (
    <div>
      <Paper withBorder radius="md" key={`${description}${date}`}>
        <UnstyledButton p="md" w="100%" h="100%" onClick={gotoTransaction}>
          <Group mb="xs" spacing={0}>
            <Badge c={category.color}>{category.name}</Badge>
          </Group>
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
              {txnAcc?.currency}
            </Text>
          </Group>

          <Group mb="sm">
            <Text color="dimmed">
              <FormattedDate value={date} dateStyle="short" timeStyle="short" />
            </Text>
          </Group>

          <Group mb="xs">
            {tags?.map((tag) => (
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
