import React from 'react';

import {
  Button,
  Card,
  Center,
  List,
  Text,
  ThemeIcon,
  Title,
  createStyles,
  rem
} from '@mantine/core';
import {
  IconCircleCheck,
  IconCircleDashed,
  IconPaw,
  IconPigMoney,
  IconPlus
} from '@tabler/icons-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

interface NoAccountsProps {}

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

export function NoAccounts(props: NoAccountsProps) {
  const { classes, theme } = useStyles();
  const { formatMessage } = useIntl();

  return (
    <Card withBorder p="2rem" my="2rem" className={classes.root}>
      <IconPigMoney size="5rem" className={classes.icon} />

      <Title order={2} mb="1rem" weight={700}>
        {formatMessage({ id: 'no-acc-found' })}
      </Title>
      <Text pb="sm" c="dimmed">
        {formatMessage({ id: 'no-acc-yet' })}
      </Text>
      <Center>
        <List
          spacing="xs"
          size="sm"
          my="1rem"
          center
          style={{ textAlign: 'left' }}
          icon={
            <ThemeIcon color="teal" size="lg" radius="xl">
              <IconPaw size="1.25rem" />
            </ThemeIcon>
          }>
          <List.Item>{formatMessage({ id: 'no-acc-1' })}</List.Item>
          <List.Item>{formatMessage({ id: 'no-acc-2' })}</List.Item>
          <List.Item>{formatMessage({ id: 'no-acc-3' })}</List.Item>
          <List.Item>{formatMessage({ id: 'no-acc-4' })}</List.Item>
        </List>
      </Center>

      <Button
        component={Link}
        to="/accounts/create"
        variant="outline"
        color="blue"
        style={{ marginTop: theme.spacing.lg }}
        leftIcon={<IconPlus />}>
        {formatMessage({ id: 'acc-create' })}
      </Button>
    </Card>
  );
}
