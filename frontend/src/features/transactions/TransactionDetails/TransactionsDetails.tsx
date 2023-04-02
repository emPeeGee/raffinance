import React, { useEffect, useState } from 'react';

import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  MantineTheme,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core';
import {
  IconAlertCircle,
  IconArrowBackUp,
  IconEdit,
  IconRocket,
  IconTrash
} from '@tabler/icons-react';
import { FormattedDate, useIntl } from 'react-intl';
import { Link, useParams } from 'react-router-dom';

import {
  TransactionDestination,
  TransactionModel,
  TransactionType,
  TransactionTypeView
} from 'features/transactions';
import { useAccountStore, useTransactionStore } from 'store';
import { getContrastColor } from 'utils';

const getTxnColor = (theme: MantineTheme, type: TransactionType) => {
  switch (type) {
    case TransactionType.INCOME:
      return theme.colors.green[3];
    case TransactionType.EXPENSE:
      return theme.colors.red[3];
    case TransactionType.TRANSFER:
      return theme.colors.violet[3];
    default:
      return theme.colors.gray[3];
  }
};

export function TransactionDetails() {
  const { formatMessage } = useIntl();
  const theme = useMantineTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [transaction, setTransaction] = useState<TransactionModel>();

  const { getTransaction } = useTransactionStore();
  const { accounts } = useAccountStore();
  const { id } = useParams();

  const fetchTransaction = async () => {
    setIsLoading(true);
    const fetchedTransaction = await getTransaction(String(id));
    setTransaction(fetchedTransaction);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  // /* TODO: Description for every field */
  if (transaction === undefined || isLoading) {
    // TODO: Skeleton instead of lading
    return <LoadingOverlay visible />;
  }

  const txnAcc = accounts.find((a) => a.id === transaction.toAccountId);

  const tagsBadges = transaction.tags ? (
    transaction.tags.map((tag) => (
      <Badge key={tag.id} bg={tag.color} size="lg" c={getContrastColor(tag.color)} variant="filled">
        {tag.name}
      </Badge>
    ))
  ) : (
    <Text>{formatMessage({ id: 'tag-no-found' })}</Text>
  );

  const txnColor = getTxnColor(theme, transaction.transactionTypeId);
  const location = transaction.location ? transaction.location : formatMessage({ id: 'co-no-loc' });
  const description = transaction.description
    ? transaction.description
    : formatMessage({ id: 'co-no-desc' });

  return (
    <Container>
      <Group my="lg">
        <Button component={Link} to="/transactions" variant="light" leftIcon={<IconArrowBackUp />}>
          {formatMessage({ id: 'co-back' })}
        </Button>

        <Title order={1}>Transaction details</Title>
      </Group>

      <Alert icon={<IconAlertCircle size="1rem" />} color="gray">
        {formatMessage({ id: 'txn-det-info' })}
      </Alert>

      <Card padding="lg" my="lg" withBorder radius="md">
        <Flex direction="column" gap="0.25rem">
          <TransactionTypeView transaction={transaction} spacing="md" withLabel withTextType />
          <TransactionDestination transaction={transaction} withLabel size="xl" />

          <Divider my="xs" />
          <Group>
            <Text fw={700}>{formatMessage({ id: 'co-amo' })}:</Text>
            <Box
              p="0.25rem"
              sx={(th) => ({
                fontWeight: 700,
                borderRadius: th.spacing.sm,
                background: txnColor,
                color: getContrastColor(txnColor)
              })}>
              {transaction.amount} {txnAcc?.currency}
            </Box>
          </Group>

          <Text fw={700}>
            {formatMessage({ id: 'co-desc' })}:{' '}
            <Text fw={500} span my="xs">
              {description}
            </Text>
          </Text>

          <Text fw={700}>
            {formatMessage({ id: 'co-date' })}:{' '}
            <Text span fw={500}>
              <FormattedDate value={transaction.date} dateStyle="full" timeStyle="medium" />
            </Text>
          </Text>

          <Text fw={700}>
            {formatMessage({ id: 'co-cre-at' })}:{' '}
            <Text span fw={500}>
              <FormattedDate value={transaction.createdAt} dateStyle="full" timeStyle="medium" />
            </Text>
          </Text>

          <Text fw={700}>
            {formatMessage({ id: 'co-las-up' })}:{' '}
            <Text span fw={500}>
              <FormattedDate value={transaction.updatedAt} dateStyle="full" timeStyle="medium" />
            </Text>
          </Text>

          <Text fw={700}>
            {formatMessage({ id: 'co-loc' })}:{' '}
            <Text span fw={500}>
              {location}
            </Text>
          </Text>

          <Divider my="sm" />

          <Group mb="xs" spacing={0} my="xs">
            <Text fw={700} mr="md">
              {formatMessage({ id: 'cat-cat' })}:{' '}
            </Text>
            <Badge
              bg={transaction.category.color}
              c={getContrastColor(transaction.category.color)}
              size="lg">
              {transaction.category.name}
            </Badge>
          </Group>

          <Group mb="xs">
            <Text fw={700}>{formatMessage({ id: 'tag-tag' })}: </Text>
            {tagsBadges}
          </Group>
        </Flex>
      </Card>

      <Card my="lg" withBorder radius="md">
        <Title order={4} mb="md">
          <Group>
            <IconRocket color="gray" />

            {formatMessage({ id: 'co-quick-act' })}
          </Group>
        </Title>
        <Group>
          <Button variant="outline" color="orange" radius="md" leftIcon={<IconEdit />}>
            {formatMessage({ id: 'co-edi' })}
          </Button>

          <Button color="red" variant="outline" radius="md" leftIcon={<IconTrash />}>
            {formatMessage({ id: 'txn-del' })}
          </Button>
        </Group>
      </Card>
    </Container>
  );
}

// TODO: WTF is dayjs
// TODO: Remove unused packages like styled components
