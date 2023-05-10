import React from 'react';

import { Card, Text, Title, createStyles, rem } from '@mantine/core';
import { IconSearchOff } from '@tabler/icons-react';
import { useIntl } from 'react-intl';

const useStyles = createStyles((theme) => ({
  root: {
    margin: '0 auto',
    textAlign: 'center'
  },

  icon: {
    color: theme.colors.blue[5]
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
  withBorder?: boolean;
}

export function NoData({ withBorder = false }: Props) {
  const { classes } = useStyles();
  const { formatMessage } = useIntl();

  return (
    <Card withBorder={withBorder} p="2rem" my="lg" className={classes.root}>
      <IconSearchOff size="5rem" className={classes.icon} />

      <Title order={3} mb="1rem" weight={700} classNames={classes.title}>
        {formatMessage({ id: 'co-no-data-tit' })}
      </Title>
      <Text pb="sm" c="dimmed">
        {formatMessage({ id: 'co-no-data-mes' })}
      </Text>
    </Card>
  );
}
