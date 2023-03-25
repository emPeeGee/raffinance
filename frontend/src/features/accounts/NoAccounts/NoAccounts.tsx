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

interface NoAccountsProps {
  onCreateAccount: () => void;
}

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

export function NoAccounts({ onCreateAccount }: NoAccountsProps) {
  const { classes, theme } = useStyles();

  return (
    <Card withBorder p="2rem" my="2rem" className={classes.root}>
      <IconPigMoney size="5rem" className={classes.icon} />

      <Title order={2} mb="1rem" weight={700}>
        No accounts found
      </Title>
      <Text pb="sm" c="dimmed">
        You haven&apos;t added any accounts yet. To get started:
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
          <List.Item>Click the &quot;Create an account&quot; button below.</List.Item>
          <List.Item>
            Choose the type of account you want to add (e.g. checking, savings, credit card).
          </List.Item>
          <List.Item>
            Enter the account details, including the name, currency, and initial balance.
          </List.Item>
          <List.Item>Click &quot;Save&quot; to create the account.</List.Item>
        </List>
      </Center>

      <Button
        variant="outline"
        color="blue"
        onClick={onCreateAccount}
        style={{ marginTop: theme.spacing.lg }}
        leftIcon={<IconPlus />}>
        Create an account
      </Button>
    </Card>
  );
}
