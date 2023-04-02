import React from 'react';

import { MantineSize, Group, Text, createStyles, rem, SpacingValue } from '@mantine/core';
import { IconCashBanknote, IconCashBanknoteOff, IconArrowsExchange } from '@tabler/icons-react';
import { useIntl } from 'react-intl';

import { TransactionModel, TransactionType } from '../transactions.model';

const useStyles = createStyles(() => ({
  value: {
    fontSize: rem(18),
    fontWeight: 700,
    lineHeight: 1
  },

  amount: {
    fontSize: rem(28),
    fontWeight: 700,
    lineHeight: 1
  }
}));

interface Props {
  transaction: TransactionModel;
  withAmount?: boolean;
  withLabel?: boolean;
  withTextType?: boolean;
  spacing?: SpacingValue;
  size?: MantineSize;
}
// TODO: Customizable primary color as user wants https://mantine.dev/theming/colors/

// TODO: Hardcoded colors
const typeMap = {
  [TransactionType.INCOME]: {
    color: '#37B24D',
    label: 'co-inc',
    icon: IconCashBanknote
  },

  [TransactionType.EXPENSE]: {
    color: '#E03131',
    label: 'co-exp',
    icon: IconCashBanknoteOff
  },

  [TransactionType.TRANSFER]: {
    color: '#7950F2',
    label: 'co-tra',
    icon: IconArrowsExchange
  }
};

export function TransactionTypeView({
  transaction,
  withTextType = false,
  withAmount = false,
  withLabel = false,
  spacing = '0.25rem',
  size = '2rem'
}: Props) {
  const { formatMessage } = useIntl();
  const { classes } = useStyles();
  const { amount, transactionTypeId } = transaction;

  const type = typeMap[transactionTypeId];
  const Icon = type.icon;

  return (
    <Group fw={700} spacing={spacing}>
      {withTextType && <Text>{formatMessage({ id: 'txn-type' })}: </Text>}

      {withLabel && (
        <Text className={classes.value} color={type.color}>
          {formatMessage({ id: type.label })}
        </Text>
      )}
      <Icon color={type.color} size={size} />
      {withAmount && (
        <Text className={classes.amount} color={type.color}>
          {amount}
        </Text>
      )}
    </Group>
  );
}
