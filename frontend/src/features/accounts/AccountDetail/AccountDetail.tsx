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
  Grid,
  SimpleGrid,
  Table,
  Container,
  SegmentedControl
} from '@mantine/core';
import { MonthPicker } from '@mantine/dates';
import { IconTrash } from '@tabler/icons-react';
import { Controller, useForm } from 'react-hook-form';
import { FormattedDate, useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import { AccountDetailsModel, AccountModel, CreateAccountDTO } from '../accounts.model';
import { useAccountStore } from '../store';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(64),
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

  useEffect(() => {
    fetchAccount();
  }, []);

  const toggleTransactions = () => setShowTransactions((show) => !show);

  // /* TODO: Description for every field */
  if (account === undefined) {
    // TODO: Skeleton instead of lading
    return <LoadingOverlay visible />;
  }

  return (
    <Container className={classes.root}>
      <Title order={1} mb="md">
        Account details
      </Title>
      <Card padding="lg" shadow="sm" withBorder radius="md">
        <Group align="flex-start">
          <Avatar
            src="https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj"
            alt={`${account.name} logo`}
            radius="lg"
            size={70}
            style={{ backgroundColor: account.color }}
          />
          <div style={{ marginLeft: 20 }}>
            <Title order={3}>{account.name}</Title>
            {/* <Text color="gray">{account.iban}</Text> */}
            <Text color="gray">
              {account.balance} {account.currency}
            </Text>
          </div>
        </Group>

        <Paper>
          <div style={{ padding: '16px' }}>
            <Text variant="subtitle1" style={{ marginTop: '8px' }}>
              Balance: {account.balance} {account.currency}
            </Text>
            <Text variant="subtitle1" style={{ marginTop: '8px' }}>
              Created at:
              <FormattedDate value={account.createdAt} dateStyle="full" timeStyle="medium" />
            </Text>
            <Text variant="subtitle1" style={{ marginTop: '8px' }}>
              Updated at:
              <FormattedDate value={account.updatedAt} dateStyle="full" timeStyle="medium" />
            </Text>
          </div>
        </Paper>

        <Button color="red" variant="outline" radius="xl" leftIcon={<IconTrash />}>
          Delete Account
        </Button>
      </Card>

      <div style={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
        <div
          style={{
            width: '16px',
            height: '16px',
            backgroundColor: account.color,
            marginRight: '8px'
          }}
        />
        <Text variant="h5">{account.name}</Text>
      </div>

      <Paper my="md">
        <Group position="apart">
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
      </Paper>

      <Group position="center">
        <MonthPicker
          value={month}
          onChange={setMonth}
          defaultDate={new Date()}
          minDate={new Date(1910, 1, 1)}
          maxDate={new Date()}
        />
      </Group>

      {showTransactions && (
        <div style={{ marginTop: 20 }}>
          <Card padding="lg" shadow="sm" withBorder radius="md">
            <Title order={3}>Transactions</Title>
            {account.transactions.map((transaction) => (
              <Paper key={transaction.id} p="sm" radius="sm" style={{ marginTop: 10 }}>
                <Group>
                  <Avatar
                    src="https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj"
                    alt={`${transaction.description} logo`}
                    radius="sm"
                    size={40}
                    style={{ backgroundColor: account.color }}
                  />
                  <div style={{ marginLeft: 10 }}>
                    <Title order={5}>{transaction.description}</Title>
                    <Text>
                      <FormattedDate value={transaction.date} />
                    </Text>
                  </div>
                </Group>
                <Text
                  weight={transaction.amount < 0 ? 'bold' : 'normal'}
                  color={transaction.amount < 0 ? 'red' : 'green'}>
                  {transaction.amount > 0 ? '+' : '-'} {Math.abs(transaction.amount)}{' '}
                  {account.currency}
                </Text>
              </Paper>
            ))}
          </Card>
        </div>
      )}
      <SimpleGrid spacing={80} cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}>
        <div>
          <Paper>
            <Table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(account?.transactions ?? []).map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.location}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: transaction.category.color,
                            marginRight: '8px'
                          }}
                        />
                        <span>{transaction.category.name}</span>
                      </div>
                    </td>
                    <td>{transaction.amount}</td>
                    <td>
                      delete
                      {/* <IconButton aria-label="delete" onClick={() => handleDelete(transaction.id)}>
                        <DeleteIcon />
                      </IconButton> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Paper>
        </div>
      </SimpleGrid>
    </Container>
  );
}

// TODO: WTF is dayjs
// TODO: Remove unused packages like styled components
