import React from 'react';

import {
  Blockquote,
  Button,
  Container,
  Group,
  Loader,
  Title,
  createStyles,
  rem
} from '@mantine/core';
import { IconInfoCircle, IconSquare } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { ViewSwitcher } from 'components';
import { AccountsList, NoAccounts } from 'features/accounts';
import { useAccountStore, useSettingsStore } from 'store';

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5]
  },

  title: {
    fontWeight: 900,
    fontSize: rem(34),
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

export function AccountsDashboard() {
  const { formatMessage } = useIntl();
  const { classes } = useStyles();
  const { accounts, pending } = useAccountStore();
  const { viewMode, setViewMode } = useSettingsStore();

  const content = accounts?.length > 0 ? <AccountsList /> : <NoAccounts />;

  return (
    <Container>
      <Group position="apart" mb="md">
        <Title className={classes.title}>{formatMessage({ id: 'acc' })}</Title>
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
        <ViewSwitcher defaultValue={viewMode} onChange={setViewMode} />
      </Group>

      {pending ? (
        <Group position="center" p="lg" mt="xl">
          <Loader />
        </Group>
      ) : (
        content
      )}
    </Container>
  );
}
