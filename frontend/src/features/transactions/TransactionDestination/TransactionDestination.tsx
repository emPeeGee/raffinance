import React from 'react';

import { Group, Badge, Text, MantineSize } from '@mantine/core';
import { IconArrowNarrowRight } from '@tabler/icons-react';
import { useIntl } from 'react-intl';

import { AccountModel } from 'features/accounts';
import { useAccountStore } from 'store';
import { getContrastColor } from 'utils';

import { TransactionModel, TransactionType } from '../transactions.model';

interface Props {
  transaction: TransactionModel;
  withLabel?: boolean;
  size?: MantineSize;
}

export function TransactionDestination({ transaction, withLabel = false, size = 'md' }: Props) {
  const { formatMessage } = useIntl();
  const { accounts } = useAccountStore();

  const toAccount = accounts.find((a) => a.id === transaction.toAccountId) as AccountModel;
  const { color: toAccountColor } = toAccount;

  const fromAcc = accounts.find((a) => a.id === transaction?.fromAccountId);

  return (
    <Group mb="xs" spacing={0}>
      {withLabel && (
        <Text fw={700} mr="md">
          {formatMessage({ id: 'co-dest' })}:{' '}
        </Text>
      )}
      <Group mb={0} spacing={0}>
        {transaction.transactionTypeId === TransactionType.TRANSFER && (
          <>
            <Badge size={size} c={getContrastColor(fromAcc?.color ?? '')} bg={fromAcc?.color}>
              {fromAcc?.name}
            </Badge>
            <IconArrowNarrowRight />
          </>
        )}
        <Badge size={size} c={getContrastColor(toAccountColor)} bg={toAccountColor}>
          {toAccount?.name}
        </Badge>
      </Group>
    </Group>
  );
}
