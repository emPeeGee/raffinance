import React, { useEffect, useState } from 'react';

import {
  Accordion,
  Alert,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Group,
  LoadingOverlay,
  Text,
  Title,
  createStyles,
  rem
} from '@mantine/core';
import { MonthPicker } from '@mantine/dates';
import {
  IconCircle,
  IconFilter,
  IconInfoCircle,
  IconPentagon,
  IconRocket,
  IconSquare,
  IconTriangle
} from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { DateRange, PieChart } from 'components';
import { TransactionTable } from 'features/transactions';
import { useAccountStore, useAnalyticsStore, useAuthStore } from 'store';
import { getRandomNumber } from 'utils';

import { Activity } from '../Activity/Activity';
import { BalanceEvo } from '../BalanceEvo/BalanceEvo';
import { CashFlow } from '../CashFlow/CashFlow';

const useStyles = createStyles((theme) => ({
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

export function Dashboard() {
  const { formatMessage } = useIntl();
  const { classes } = useStyles();
  const { user } = useAuthStore();
  const {
    pending,
    date,
    setDate,
    getCategoriesIncome,
    getCategoriesSpending,
    categoriesIncome,
    categoriesSpending,
    topTransactions,
    getTopTransactions
  } = useAnalyticsStore();
  const { accounts } = useAccountStore();

  const [randomGreeting] = useState(
    formatMessage({ id: `dsh-greeting-${getRandomNumber(1, 22)}` }, { name: user?.name })
  );

  useEffect(() => {
    getCategoriesIncome();
    getCategoriesSpending();
    getTopTransactions();
  }, []);

  return (
    <Container my="xl">
      <LoadingOverlay visible={pending} />
      <Box>
        <Title className={classes.title}>
          Dashboard
          <Text inline color="blue">
            <DateRange range={date} variant="analytics" />
          </Text>
        </Title>
        <Text mb="sm" c="dimmed" size="lg">
          {randomGreeting}
        </Text>
        <Card withBorder radius="md" mb="sm">
          <Title order={4} mb="sm">
            <Group>
              <IconRocket color="gray" />
              {formatMessage({ id: 'co-quick-act' })}
            </Group>
          </Title>
          <Group>
            {/* NOTE: Every entity has a associated shape and color */}
            <Button
              component={Link}
              to="/transactions/create"
              variant="outline"
              color="cyan"
              radius="md"
              leftIcon={<IconCircle />}>
              {formatMessage({ id: 'txn-create' })}
            </Button>

            <Button
              component={Link}
              to="/accounts/create"
              variant="outline"
              color="lime"
              radius="md"
              leftIcon={<IconSquare />}>
              {formatMessage({ id: 'acc-create' })}
            </Button>

            <Button
              component={Link}
              to="/categories/create"
              variant="outline"
              color="pink"
              radius="md"
              leftIcon={<IconTriangle />}>
              {formatMessage({ id: 'cat-create' })}
            </Button>

            <Button
              component={Link}
              to="/tags/create"
              variant="outline"
              radius="md"
              color="grape"
              leftIcon={<IconPentagon />}>
              {formatMessage({ id: 'tag-create' })}
            </Button>
          </Group>
        </Card>
        <Accordion variant="separated" radius="md" my="sm" defaultValue="da">
          <Accordion.Item value="da">
            <Accordion.Control icon={<IconFilter />}>
              {formatMessage({ id: 'dsh-filter' })}
            </Accordion.Control>
            <Accordion.Panel>
              <Alert color="gray" mb="sm" icon={<IconInfoCircle />}>
                {formatMessage({ id: 'dsh-month-help' })}
              </Alert>
              {/* <SimpleGrid
                spacing={80}
                cols={2}
                breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}> */}
              <Group>
                <MonthPicker type="range" defaultValue={date} onChange={setDate} mx="auto" />
              </Group>
              {/* TODO */}
              {/* <Flex direction="column">
                  <Title order={3} mb="xs">
                    {formatMessage({ id: 'acc' })}
                  </Title>
                  <Chip.Group multiple>
                    <Flex justify="start" gap="xs" w="100%" wrap="wrap">
                      {accounts?.map((acc) => (
                        <Chip key={acc.id} value={String(acc.id)} variant="light">
                          {acc.name}
                        </Chip>
                      ))}
                    </Flex>
                  </Chip.Group>
                </Flex> */}
              {/* </SimpleGrid> */}
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <Activity />
        {/* TODO: Component */}
        <Box my="sm" w="100%">
          <Card withBorder radius="lg" p="md">
            <Title order={2}>{formatMessage({ id: 'dsh-top-txn' })}</Title>
            <TransactionTable transactions={topTransactions} />
          </Card>
        </Box>
        <CashFlow />
        <Flex w="100%" h="100%" gap="sm" justify="space-between">
          <PieChart title="Categories spending" height={400} data={categoriesSpending} />
          <PieChart title="Categories income" height={400} data={categoriesIncome} />
        </Flex>
        <BalanceEvo />
      </Box>
    </Container>
  );
}

// TODO: Create a comp, EntityCreateButton which will have all entities predefined and will avoid duplication

// balance trend
// by cats, by tags
// last trans

// user will have a list of widgets, based on this list request will be made and backend will handle it
