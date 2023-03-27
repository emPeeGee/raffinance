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
  Paper,
  SimpleGrid,
  Table,
  Container,
  SegmentedControl,
  UnstyledButton,
  Badge
} from '@mantine/core';
import { MonthPicker } from '@mantine/dates';
import { IconEdit, IconMinus, IconPlus, IconRocket, IconTrash } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { FormattedDate, useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import { getContrastColor } from 'utils';

import { AccountDetailsModel, CreateAccountDTO, TransactionType } from '../accounts.model';
import { useAccountStore } from '../store';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(64),
    paddingBottom: rem(120)
  },

  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5]
  },

  transactionTitle: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32)
    }
  },

  value: {
    fontSize: rem(28),
    fontWeight: 700,
    lineHeight: 1
  },

  accountCard: {
    borderRadius: 10,
    width: 'fit-content',
    // filter: 'alpha(opacity=60)'
    // backgroundColor:
    //   theme.colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)'
    // backgroundColor:
    // theme.colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)'
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
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<CreateAccountDTO>({
    mode: 'onChange'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<AccountDetailsModel>();
  const [month, setMonth] = useState<Date | null>(null);

  const { getAccount } = useAccountStore();
  const navigate = useNavigate();
  const { id } = useParams();

  const [showTransactions, setShowTransactions] = useState(true);

  const fetchAccount = async () => {
    setIsLoading(true);
    const aaa = await getAccount(String(id));
    console.log(aaa);
    setAccount(aaa);

    setIsLoading(false);
  };

  const gotoTransaction = (txnId: number) => () => {};

  useEffect(() => {
    fetchAccount();
  }, []);

  const toggleTransactions = () => setShowTransactions((show) => !show);

  // /* TODO: Description for every field */
  if (account === undefined) {
    // TODO: Skeleton instead of lading
    return <LoadingOverlay visible />;
  }

  const textColor = getContrastColor(account.color);

  return (
    <Container className={classes.root}>
      <Title order={1} mb="md">
        Account details
      </Title>
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
              Balance: {account.balance} {account.currency}
            </Text>
          </div>
        </Group>

        <Group position="left">
          <Text fw={700} c={textColor} className={classes.accountText}>
            Created at:
          </Text>
          <Text c={textColor} my="xs" className={classes.accountText}>
            <FormattedDate value={account.createdAt} dateStyle="full" timeStyle="medium" />
          </Text>
        </Group>

        <Group position="left">
          <Text fw={700} c={textColor} className={classes.accountText}>
            Updated at:
          </Text>
          <Text c={textColor} className={classes.accountText}>
            <FormattedDate value={account.updatedAt} dateStyle="full" timeStyle="medium" />
          </Text>
        </Group>
      </Card>

      <Card my="lg" withBorder radius="md">
        <Title order={4} mb="md" color="gray">
          <Group>
            <IconRocket color="gray" />
            Quick actions
          </Group>
        </Title>
        <Group>
          <Button variant="outline" radius="md" leftIcon={<IconEdit />}>
            Update
          </Button>

          <Button color="red" variant="outline" radius="md" leftIcon={<IconTrash />}>
            Delete Account
          </Button>
        </Group>
      </Card>

      <Card my="lg" withBorder radius="md">
        <Group position="apart" mb="md">
          <SegmentedControl
            value="all"
            // onChange={(value: ViewMode) => setViewMode(value)}
            data={[
              { label: formatMessage({ id: 'co-all' }), value: 'all' },
              { label: formatMessage({ id: 'co-income' }), value: 'table' },
              { label: formatMessage({ id: 'co-expense' }), value: 'ex' },
              { label: formatMessage({ id: 'co-transfers' }), value: 'card' }
            ]}
          />

          <Button variant="light" onClick={toggleTransactions}>
            {showTransactions ? 'Hide transactions' : 'Show transactions'}
          </Button>
        </Group>

        <Group position="center">
          <MonthPicker
            value={month}
            onChange={setMonth}
            defaultDate={new Date()}
            minDate={new Date(1910, 1, 1)}
            maxDate={new Date()}
          />
        </Group>
      </Card>

      {/* {viewMode === 'card' && ( */}
      <SimpleGrid
        cols={4}
        my="lg"
        breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 }
        ]}>
        {account.transactions.map(
          ({ id: txnId, description, date, amount, category, transactionTypeId, tags }) => {
            // const textColor = getContrastColor(color);

            return (
              <Paper
                withBorder
                p="md"
                radius="md"
                key={`${description}${date}`}
                className={classes.root}>
                <Group mb="xs">
                  <Badge c={category.color}>{category.name}</Badge>
                </Group>
                <UnstyledButton onClick={gotoTransaction(txnId)}>
                  <Group position="apart">
                    <Title order={5} mb="sm" className={classes.transactionTitle}>
                      {description}
                    </Title>
                  </Group>

                  <Group align="flex-end" mb="xs">
                    <div>
                      {transactionTypeId === TransactionType.INCOME && (
                        <Text className={classes.value} color="green">
                          <IconPlus color="green" /> {amount}
                        </Text>
                      )}

                      {transactionTypeId === TransactionType.EXPENSE && (
                        <Text className={classes.value} color="red">
                          <IconMinus /> {amount}
                        </Text>
                      )}

                      {transactionTypeId === TransactionType.TRANSFER && (
                        <Text className={classes.value} color="violet">
                          {' '}
                          <IconPlus /> {amount}
                        </Text>
                      )}
                    </div>

                    <Text>{account.currency}</Text>
                  </Group>

                  <Group mb="sm">
                    <Text color="dimmed">
                      <FormattedDate value={date} dateStyle="short" timeStyle="short" />
                    </Text>
                  </Group>

                  <Group mb="xs">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        bg={tag.color}
                        c={getContrastColor(tag.color)}
                        variant="filled">
                        {tag.name}
                      </Badge>
                    ))}
                  </Group>
                </UnstyledButton>
              </Paper>
            );
          }
        )}
      </SimpleGrid>

      {showTransactions && (
        <div>
          <Paper withBorder radius="md">
            <Table>
              <thead>
                <tr>
                  <th>Date</th>
                  {/* TODO: type as transated text */}
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Tags</th>
                </tr>
              </thead>
              <tbody>
                {(account?.transactions ?? []).map(
                  ({ id: txnId, transactionTypeId, amount, description, category, tags, date }) => (
                    <tr key={txnId}>
                      <td>
                        <FormattedDate value={date} dateStyle="short" timeStyle="short" />
                      </td>
                      <td>{transactionTypeId}</td>
                      <td>{description}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div
                            style={{
                              width: '16px',
                              height: '16px',
                              backgroundColor: category.color,
                              marginRight: '8px'
                            }}
                          />

                          <Group mb="xs">
                            <Badge c={category.color}>{category.name}</Badge>
                          </Group>
                        </div>
                      </td>
                      <td>{amount}</td>
                      <td>
                        {tags.map((tag) => (
                          <Badge
                            key={tag.id}
                            mr="xs"
                            bg={tag.color}
                            c={getContrastColor(tag.color)}
                            variant="filled">
                            {tag.name}
                          </Badge>
                        ))}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          </Paper>
        </div>
      )}
    </Container>
  );
}

// TODO: WTF is dayjs
// TODO: Remove unused packages like styled components
