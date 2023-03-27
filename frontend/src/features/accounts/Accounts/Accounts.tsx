import React, { useEffect } from 'react';

import { Button, Container, Group, Title, createStyles, rem, Blockquote } from '@mantine/core';
import { IconHeartPlus, IconInfoCircle } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { AccountsList, AccountViewSwitcher, NoAccounts } from 'features/accounts';

import { useAccountStore } from '../../../store/accounts.store';

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

  const { accounts, getAccounts } = useAccountStore();

  useEffect(() => {
    getAccounts();
  }, []);

  return (
    <Container className={classes.root}>
      <Group position="apart" py="sm">
        <Title className={classes.title}>{formatMessage({ id: 'accounts' })}</Title>
        <Button component={Link} to="/accounts/create" variant="light" leftIcon={<IconHeartPlus />}>
          {formatMessage({ id: 'account-create' })}
        </Button>
      </Group>
      <Blockquote
        fz={rem('1rem')}
        px={0}
        c="dimmed"
        icon={<IconInfoCircle size="2rem" className={classes.icon} />}>
        {formatMessage({ id: 'accounts-info' })}
      </Blockquote>
      <Group>
        <AccountViewSwitcher />
      </Group>

      {accounts.length > 0 ? <AccountsList /> : <NoAccounts />}
    </Container>
  );
}
