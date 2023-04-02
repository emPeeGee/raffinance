import React, { forwardRef } from 'react';

import { createStyles, rem, SegmentedControlProps, SegmentedControl } from '@mantine/core';
import { useIntl } from 'react-intl';

import { TransactionType } from 'features/transactions';

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1]
    }`
  },

  control: {
    border: '0 !important'
  },

  label: {
    '&, &:hover': {
      '&[data-active]': {
        color: theme.white
      }
    }
  }
}));

const getItems = (formatMessage: any) => {
  return [
    { label: formatMessage({ id: 'co-inc' }) as string, value: String(TransactionType.INCOME) },
    { label: formatMessage({ id: 'co-exp' }) as string, value: String(TransactionType.EXPENSE) },
    { label: formatMessage({ id: 'co-tra' }) as string, value: String(TransactionType.TRANSFER) }
  ];
};

// TODO: use it in filter component
function Picker(props: Omit<SegmentedControlProps, 'data'>, ref: React.Ref<any>) {
  const { classes, theme } = useStyles();
  const { formatMessage } = useIntl();
  const { value } = props;

  const indicators = {
    [TransactionType.INCOME]: {
      backgroundImage: theme.fn.gradient({
        from: theme.colors.green[4],
        to: theme.colors.green[7]
      })
    },

    [TransactionType.EXPENSE]: {
      backgroundImage: theme.fn.gradient({
        from: theme.colors.red[4],
        to: theme.colors.red[7]
      })
    },
    [TransactionType.TRANSFER]: {
      backgroundImage: theme.fn.gradient({
        from: theme.colors.violet[4],
        to: theme.colors.violet[7]
      })
    }
  };

  const indicator = indicators[Number(value) as TransactionType];

  return (
    <SegmentedControl
      {...props}
      ref={ref}
      radius="xl"
      size="md"
      data={getItems(formatMessage)}
      styles={{ indicator }}
      classNames={classes}
    />
  );
}

export const TransactionTypePicker = forwardRef(Picker);
