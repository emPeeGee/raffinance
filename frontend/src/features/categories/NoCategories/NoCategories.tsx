import React from 'react';

import { Button, Card, Text, Title, createStyles, rem } from '@mantine/core';
import { IconPlus, IconSearchOff } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

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

interface Props {}

export function NoCategories(props: Props) {
  const { classes } = useStyles();
  const { formatMessage } = useIntl();

  return (
    <Card withBorder p="2rem" my="lg" className={classes.root}>
      <IconSearchOff size="5rem" className={classes.icon} />

      <Title order={2} mb="1rem" weight={700} classNames={classes.title}>
        {formatMessage({ id: 'cat-no-found' })}
      </Title>
      <Text pb="sm" c="dimmed">
        {formatMessage({ id: 'cat-no-desc' })}
      </Text>

      <Button
        component={Link}
        to="/categories/create"
        style={{ marginTop: 20 }}
        variant="outline"
        color="blue"
        leftIcon={<IconPlus />}>
        {formatMessage({ id: 'cat-create' })}
      </Button>
    </Card>
  );
}
