import React from 'react';

import { Group, Badge, Text, MantineSize } from '@mantine/core';
import { IconArrowNarrowRight } from '@tabler/icons-react';
import { useIntl } from 'react-intl';

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

  if (transaction.transactionTypeId !== TransactionType.TRANSFER) {
    return null;
  }

  const txnAcc = accounts.find((a) => a.id === transaction.toAccountId);
  const fromAccountName = accounts.find((a) => a.id === transaction?.fromAccountId)?.name;
  const { color } = transaction.category;

  return (
    <Group mb="xs" spacing={0} my="xs">
      {withLabel && (
        <Text fw={700} mr="md">
          {formatMessage({ id: 'co-dest' })}:{' '}
        </Text>
      )}
      <Group mb={0} spacing={0}>
        <Badge size={size} c={getContrastColor(color)} bg={color}>
          {fromAccountName}
        </Badge>
        <IconArrowNarrowRight />
        <Badge size={size} c={getContrastColor(color)} bg={color}>
          {txnAcc?.name}
        </Badge>
      </Group>
    </Group>
  );
}
