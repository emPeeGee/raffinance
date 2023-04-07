import React, { useEffect } from 'react';

import { Button, Container, Group, Title, createStyles, rem, Blockquote } from '@mantine/core';
import { IconHeartPlus, IconInfoCircle, IconSquare } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { ViewSwitcher } from 'components';
import { AccountsList, NoAccounts } from 'features/accounts';
import { useAccountStore } from 'store';
import { ViewMode } from 'utils';

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

  const { viewMode, accounts, getAccounts, setViewMode } = useAccountStore();

  useEffect(() => {
    getAccounts();
  }, []);

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <Container className={classes.root}>
      <Group position="apart" py="sm">
        <Title className={classes.title}>{formatMessage({ id: 'accounts' })}</Title>
        <Button
          component={Link}
          to="/accounts/create"
          variant="light"
          color="lime"
          leftIcon={<IconSquare />}>
          {formatMessage({ id: 'acc-create' })}
        </Button>
      </Group>
      <Blockquote
        fz={rem('1rem')}
        px={0}
        c="dimmed"
        icon={<IconInfoCircle size="2rem" className={classes.icon} />}>
        {formatMessage({ id: 'acc-info' })}
      </Blockquote>
      <Group>
        <ViewSwitcher defaultValue={viewMode} onChange={handleViewChange} />
      </Group>

      {accounts.length > 0 ? <AccountsList /> : <NoAccounts />}
    </Container>
  );
}
