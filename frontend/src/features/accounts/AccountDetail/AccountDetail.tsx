import React, { useEffect, useState } from 'react';

import {
  Button,
  Card,
  Avatar,
  createStyles,
  Title,
  Group,
  Text,
  LoadingOverlay,
  Container,
  Alert,
  Modal,
  Flex,
  ThemeIcon
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconAlertCircle,
  IconArrowBackUp,
  IconCircle,
  IconEdit,
  IconRocket,
  IconTrash
} from '@tabler/icons-react';
import { FormattedDate, useIntl } from 'react-intl';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { ConfirmDelete, Iconify } from 'components';
import { AccountDetailsModel } from 'features/accounts';
import { TransactionsList } from 'features/transactions';
import { useAccountStore } from 'store';
import { getContrastColor } from 'utils';

const useStyles = createStyles((theme) => ({
  accountCard: {
    borderRadius: 10,
    width: 'fit-content',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
    backgroundColor:
      theme.colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)'
  }
}));

export function AccountDetail() {
  const { formatMessage } = useIntl();
  const { classes } = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<AccountDetailsModel>();

  const [opened, { open, close }] = useDisclosure(false);

  const { getAccount, deleteAccount } = useAccountStore();
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchAccount = async () => {
    setIsLoading(true);
    const fetchedAccount = await getAccount(String(id), true);
    setAccount(fetchedAccount);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  // /* TODO: Description for every field */
  if (account === undefined || isLoading) {
    // TODO: Skeleton instead of lading
    return <LoadingOverlay visible />;
  }

  const onDeleteClick = async () => {
    const ok = await deleteAccount(account.id);
    if (ok) {
      navigate('/accounts');
      notifications.show({
        message: formatMessage({ id: 'co-del-suc' }),
        color: 'green'
      });
    } else {
      notifications.show({
        message: formatMessage({ id: 'co-del-err' }),
        color: 'red'
      });
    }

    close();
  };

  const textColor = getContrastColor(account.color);

  return (
    <Container>
      <Group my="lg">
        <Button component={Link} to="/accounts" variant="light" leftIcon={<IconArrowBackUp />}>
          {formatMessage({ id: 'co-back' })}
        </Button>

        <Title order={1}>Account details</Title>
      </Group>

      <Card padding="lg" my="lg" radius="md" bg={account.color} classNames={classes.accountCard}>
        <Group align="flex-start" mb="sm">
          <ThemeIcon bg="rgba(0, 0, 0, 0.7)" radius="lg" size={70}>
            <Iconify color={textColor} icon={account.icon} size="3rem" />
          </ThemeIcon>

          <div style={{ marginLeft: 20 }}>
            <Title order={3} c={textColor}>
              {account.name}
            </Title>
            {/* <Text color="gray">{account.iban}</Text> */}

            <Text
              variant="subtitle1"
              className={classes.accountCard}
              p="0.3rem 0.7rem"
              style={{ marginTop: '8px' }}>
              {formatMessage({ id: 'co-bal' })}: {account.balance} {account.currency}
            </Text>
          </div>
        </Group>
        {/* TODO: different widths */}

        <Flex gap="sm">
          <Flex direction="column" gap="0.3rem">
            <Text fw={700} c={textColor}>
              {formatMessage({ id: 'co-cre-at' })}
            </Text>

            <Text fw={700} c={textColor}>
              {formatMessage({ id: 'co-las-up' })}
            </Text>
          </Flex>

          <Flex direction="column" gap="0.3rem">
            <Text c={textColor}>
              <FormattedDate value={account.createdAt} dateStyle="full" timeStyle="medium" />
            </Text>

            <Text c={textColor}>
              <FormattedDate value={account.updatedAt} dateStyle="full" timeStyle="medium" />
            </Text>
          </Flex>
        </Flex>
      </Card>

      <Alert icon={<IconAlertCircle size="1rem" />} color="gray">
        {formatMessage({ id: 'acc-det-info' })}
      </Alert>

      <Card my="lg" withBorder radius="md">
        <Title order={4} mb="md">
          <Group>
            <IconRocket color="gray" />

            {formatMessage({ id: 'co-quick-act' })}
          </Group>
        </Title>
        <Group>
          <Button
            component={Link}
            to="/transactions/create"
            state={{ toAccountId: account.id }}
            variant="outline"
            color="cyan"
            radius="md"
            leftIcon={<IconCircle />}>
            {formatMessage({ id: 'txn-create' })}
          </Button>

          <Button
            component={Link}
            to={`/accounts/${id}/edit`}
            variant="outline"
            color="orange"
            radius="md"
            leftIcon={<IconEdit />}>
            {formatMessage({ id: 'co-edi' })}
          </Button>

          <Button color="red" variant="outline" radius="md" leftIcon={<IconTrash />} onClick={open}>
            {formatMessage({ id: 'acc-del' })}
          </Button>
        </Group>
      </Card>

      <TransactionsList transactions={account.transactions} currency={account.currency} />

      <Modal
        opened={opened}
        onClose={close}
        title={<Title order={3}>{formatMessage({ id: 'txn-del' })}</Title>}>
        <ConfirmDelete onClose={close} onDelete={onDeleteClick} confirmName={account.name} />
      </Modal>
    </Container>
  );
}

// TODO: WTF is dayjs
// TODO: Remove unused packages like styled components
