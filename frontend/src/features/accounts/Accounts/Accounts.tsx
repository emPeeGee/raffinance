import React from 'react';
import {
  Text,
  Button,
  Container,
  Group,
  SimpleGrid,
  Title,
  createStyles,
  rem,
  Blockquote
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { IconHeartPlus, IconInfoCircle } from '@tabler/icons-react';
import { NoAccounts } from '../NoAccounts/NoAccounts';

// TODO: Breadcrumbs ???

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(120),
    paddingBottom: rem(120)
  },

  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5]
  },

  title: {
    fontWeight: 900,
    fontSize: rem(34),
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32)
    }
  },

  control: {
    [theme.fn.smallerThan('sm')]: {
      width: '100%'
    }
  },

  mobileImage: {
    [theme.fn.largerThan('sm')]: {
      display: 'none'
    }
  },

  desktopImage: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none'
    }
  }
}));

export function Accounts() {
  const { formatMessage } = useIntl();
  const { classes } = useStyles();

  const createAccount = () => {
    console.log('Create');
  };

  return (
    <Container className={classes.root}>
      <Group position="apart" py="sm">
        <Title className={classes.title}>Accounts</Title>
        <Button variant="light" leftIcon={<IconHeartPlus />} onClick={createAccount}>
          Create account
        </Button>
      </Group>
      <Text>{formatMessage({ id: 'test' })}</Text>
      <Blockquote
        fz={rem('1rem')}
        c="dimmed"
        icon={<IconInfoCircle size="2rem" className={classes.icon} />}>
        Accounts represent a user&apos;s financial entity, such as a bank account, credit card, or
        investment account. You can add, edit, and delete accounts in the app to track their
        balances and transactions.
      </Blockquote>
      <NoAccounts onCreateAccount={createAccount} />
      <SimpleGrid spacing={80} cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}>
        <div>
          <Button
            to="/"
            component={Link}
            variant="outline"
            size="md"
            mt="xl"
            className={classes.control}>
            Get back to home page
          </Button>
        </div>
      </SimpleGrid>
    </Container>
  );
}
