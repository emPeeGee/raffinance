import React, { forwardRef } from 'react';

import { createStyles, rem, SegmentedControlProps, SegmentedControl } from '@mantine/core';
import { useIntl } from 'react-intl';

import { TransactionType, TransactionTypeWithAll } from 'features/transactions';

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

const getItems = (formatMessage: any, withAll: boolean) => {
  return [
    ...(withAll
      ? [
          {
            label: formatMessage({ id: 'co-all' }),
            value: String(TransactionTypeWithAll.ALL)
          }
        ]
      : []),
    {
      label: formatMessage({ id: 'co-inc' }),
      value: String(TransactionTypeWithAll.INCOME)
    },
    {
      label: formatMessage({ id: 'co-exp' }),
      value: String(TransactionTypeWithAll.EXPENSE)
    },
    {
      label: formatMessage({ id: 'co-tra' }),
      value: String(TransactionTypeWithAll.TRANSFER)
    }
  ];
};

interface Props extends Omit<SegmentedControlProps, 'data'> {
  withAll?: boolean;
}

function Picker({ value, withAll = false, ...props }: Props, ref: React.Ref<any>) {
  const { classes, theme } = useStyles();
  const { formatMessage } = useIntl();

  const indicators = {
    [TransactionTypeWithAll.ALL]: {
      backgroundImage: theme.fn.gradient({
        from: theme.colors.yellow[4],
        to: theme.colors.yellow[7]
      })
    },
    [TransactionTypeWithAll.INCOME]: {
      backgroundImage: theme.fn.gradient({
        from: theme.colors.green[4],
        to: theme.colors.green[7]
      })
    },

    [TransactionTypeWithAll.EXPENSE]: {
      backgroundImage: theme.fn.gradient({
        from: theme.colors.red[4],
        to: theme.colors.red[7]
      })
    },
    [TransactionTypeWithAll.TRANSFER]: {
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
      data={getItems(formatMessage, withAll)}
      styles={{ indicator }}
      classNames={classes}
    />
  );
}

export const TransactionTypePicker = forwardRef(Picker);
