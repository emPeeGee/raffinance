import React from 'react';

import { Badge, Group, Paper, Text, Title, UnstyledButton, createStyles, rem } from '@mantine/core';
import { FormattedDate } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import {
  TransactionDestination,
  TransactionModel,
  TransactionTypeView
} from 'features/transactions';
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
  const { id, category, tags, date, description } = transaction;
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
      <Paper withBorder h="100%" radius="md" key={`${description}${date}`}>
        <UnstyledButton p="md" w="100%" h="100%" onClick={gotoTransaction}>
          <Group mb="xs" spacing={0}>
            <Badge bg={category.color} c={getContrastColor(category.color)}>
              {category.name}
            </Badge>
          </Group>
          <Group position="apart">
            <Title order={5} mb="sm" className={classes.transactionTitle}>
              {description}
            </Title>
          </Group>

          <Group align="center" mb="xs" spacing="0.25rem">
            <TransactionTypeView transaction={transaction} withAmount />
            <Text className={classes.currency} size="sm" fw={500}>
              {txnAcc?.currency}
            </Text>
          </Group>

          <TransactionDestination transaction={transaction} />

          <Group mb="sm">
            <Text color="dimmed">
              <FormattedDate value={date} dateStyle="short" timeStyle="short" />
            </Text>
          </Group>

          <Group>
            {tags?.map((tag) => (
              <Badge key={tag.id} bg={tag.color} c={getContrastColor(tag.color)} variant="filled">
                {tag.name}
              </Badge>
            ))}
          </Group>
        </UnstyledButton>
      </Paper>
    </div>
  );
}
