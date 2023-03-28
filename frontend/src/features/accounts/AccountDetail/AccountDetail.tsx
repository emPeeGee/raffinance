import React, { useEffect, useState } from 'react';

import {
  Button,
  Card,
  Avatar,
  createStyles,
  rem,
  Title,
  Group,
  Text,
  LoadingOverlay,
  Container,
  Alert
} from '@mantine/core';
import {
  IconAlertCircle,
  IconArrowBackUp,
  IconEdit,
  IconRocket,
  IconTrash
} from '@tabler/icons-react';
import { FormattedDate, useIntl } from 'react-intl';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { AccountDetailsModel } from 'features/accounts';
import { TransactionsList } from 'features/transactions';
import { useAccountStore } from 'store';
import { getContrastColor } from 'utils';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(64),
    paddingBottom: rem(120)
  },

  accountCard: {
    borderRadius: 10,
    width: 'fit-content',
    backgroundColor:
      theme.colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)'
  },

  accountText: {
    // color: theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[1]
  }
}));

export function AccountDetail() {
  const { formatMessage } = useIntl();
  const { classes } = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<AccountDetailsModel>();

  const { viewMode, getAccount } = useAccountStore();
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchAccount = async () => {
    setIsLoading(true);
    const fetchedAccount = await getAccount(String(id));
    setAccount(fetchedAccount);
    setIsLoading(false);
  };

  const gotoTransaction = (txnId: number) => () => {};

  useEffect(() => {
    fetchAccount();
  }, []);

  // /* TODO: Description for every field */
  if (account === undefined || isLoading) {
    // TODO: Skeleton instead of lading
    return <LoadingOverlay visible />;
  }

  const textColor = getContrastColor(account.color);

  return (
    <Container className={classes.root}>
      <Group my="lg">
        <Button component={Link} to="/accounts" variant="light" leftIcon={<IconArrowBackUp />}>
          {formatMessage({ id: 'co-back' })}
        </Button>

        <Title order={1}>Account details</Title>
      </Group>

      <Card
        padding="lg"
        my="lg"
        // shadow="sm"
        // withBorder
        radius="md"
        bg={account.color}
        classNames={classes.accountCard}>
        <Group align="flex-start">
          <Avatar
            src="https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj"
            alt={`${account.name} logo`}
            radius="lg"
            size={70}
            c={textColor}
            style={{ backgroundColor: account.color }}
          />
          <div style={{ marginLeft: 20 }}>
            <Title order={3} c={textColor} className={classes.accountText}>
              {account.name}
            </Title>
            {/* <Text color="gray">{account.iban}</Text> */}

            <Text
              variant="subtitle1"
              className={classes.accountCard}
              c={textColor}
              p="0.3rem 0.7rem"
              style={{ marginTop: '8px' }}>
              {formatMessage({ id: 'co-bal' })}: {account.balance} {account.currency}
            </Text>
          </div>
        </Group>

        <Group position="left">
          <Text fw={700} c={textColor} className={classes.accountText}>
            {formatMessage({ id: 'co-cre-at' })}:
          </Text>
          <Text c={textColor} my="xs" className={classes.accountText}>
            <FormattedDate value={account.createdAt} dateStyle="full" timeStyle="medium" />
          </Text>
        </Group>

        <Group position="left">
          <Text fw={700} c={textColor} className={classes.accountText}>
            {formatMessage({ id: 'co-cre-at' })}:
          </Text>
          <Text c={textColor} className={classes.accountText}>
            <FormattedDate value={account.updatedAt} dateStyle="full" timeStyle="medium" />
          </Text>
        </Group>
      </Card>

      <Alert icon={<IconAlertCircle size="1rem" />} color="gray">
        {formatMessage({ id: 'acc-det-info' })}
      </Alert>

      <Card my="lg" withBorder radius="md">
        <Title order={4} mb="md" color="gray">
          <Group>
            <IconRocket color="gray" />

            {formatMessage({ id: 'co-quick-act' })}
          </Group>
        </Title>
        <Group>
          <Button variant="outline" radius="md" leftIcon={<IconEdit />}>
            {/* TODO The selected account should be this one */}
            {formatMessage({ id: 'txn-add-t' })}
          </Button>

          <Button variant="outline" color="orange" radius="md" leftIcon={<IconEdit />}>
            {formatMessage({ id: 'co-update' })}
          </Button>

          <Button color="red" variant="outline" radius="md" leftIcon={<IconTrash />}>
            {formatMessage({ id: 'acc-del' })}
          </Button>
        </Group>
      </Card>

      <TransactionsList
        transactions={account.transactions}
        viewMode={viewMode}
        currency={account.currency}
      />
    </Container>
  );
}

// TODO: WTF is dayjs
// TODO: Remove unused packages like styled components
