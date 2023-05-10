import React from 'react';

import { Button, Card, Text, Title, createStyles, rem } from '@mantine/core';
import { IconPlus, IconSearchOff } from '@tabler/icons-react';
import { FormattedDate, useIntl } from 'react-intl';

const useStyles = createStyles((theme) => ({
  root: {
    margin: '0 auto',
    textAlign: 'center'
  },

  icon: {
    color: theme.colors.blue[5]
    // color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5]
  },

  title: {
    fontWeight: 900,
    fontSize: rem(34),
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32)
    }
  }
}));

interface Props {
  range?: [Date | null, Date | null];
}

export function NoTransactions({ range }: Props) {
  const { classes } = useStyles();
  const { formatMessage } = useIntl();

  // calculates the rangeView, or null if range is falsy
  const rangeView = range
    ? (() => {
        const [startDate, endDate] = range;
        return endDate ? (
          <Text span c="blue">
            <FormattedDate month="long" year="2-digit" value={startDate ?? ''} />
            {' - '}
            <FormattedDate month="long" year="2-digit" value={endDate ?? ''} />
          </Text>
        ) : (
          <FormattedDate month="long" year="2-digit" value={startDate ?? ''} />
        );
      })()
    : null;

  return (
    <Card withBorder p="2rem" my="lg" className={classes.root}>
      <IconSearchOff size="5rem" className={classes.icon} />

      <Title order={2} mb="1rem" weight={700} classNames={classes.title}>
        {range?.[0] !== null
          ? formatMessage({ id: 'no-txn-found-for' }, { range: rangeView })
          : formatMessage({ id: 'no-txn-found' })}
      </Title>
      <Text pb="sm" c="dimmed">
        {formatMessage({ id: 'no-txn-desc' })}
      </Text>

      <Button style={{ marginTop: 20 }} variant="outline" color="blue" leftIcon={<IconPlus />}>
        {formatMessage({ id: 'txn-create' })}
      </Button>
    </Card>
  );
}
