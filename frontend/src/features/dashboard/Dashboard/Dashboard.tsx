import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Flex,
  Group,
  SimpleGrid,
  Text,
  Title,
  createStyles,
  rem
} from '@mantine/core';
import { MonthPicker } from '@mantine/dates';
import {
  IconCircle,
  IconPentagon,
  IconRocket,
  IconSquare,
  IconTriangle
} from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { PieChart } from 'components';
import { useAccountStore, useAnalyticsStore, useAuthStore } from 'store';
import { getRandomNumber } from 'utils';

import { BalanceEvo } from '../BalanceEvo/BalanceEvo';

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
    date,
    setDate,
    getCategoriesIncome,
    getCategoriesSpending,
    categoriesIncome,
    categoriesSpending
  } = useAnalyticsStore();
  const { accounts } = useAccountStore();

  const [randomGreeting] = useState(
    formatMessage({ id: `dsh-greeting-${getRandomNumber(1, 22)}` }, { name: user?.name })
  );

  useEffect(() => {
    getCategoriesIncome();
    getCategoriesSpending();
  }, []);

  return (
    <Container my="xl">
      <Box>
        <Title className={classes.title}>Dashboard</Title>
        <Text mb="sm" c="dimmed" size="lg">
          {randomGreeting}
        </Text>
        <Card withBorder radius="md" mb="md">
          <Title order={4} mb="md">
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

        {date[0]?.toDateString()}
        {date[1]?.toDateString()}

        <Card withBorder radius="md">
          <SimpleGrid
            spacing={80}
            cols={2}
            breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}>
            <MonthPicker
              w="40"
              type="range"
              defaultValue={date}
              onChange={setDate}
              mx="auto"
              maw={400}
            />

            <Flex direction="column">
              <Title order={3} mb="xs">
                {formatMessage({ id: 'acc' })}
              </Title>
              {/* TODO */}
              <Chip.Group multiple>
                <Flex justify="start" gap="xs" w="100%" wrap="wrap">
                  {accounts.map((acc) => (
                    <Chip key={acc.id} value={String(acc.id)} variant="light">
                      {acc.name}
                    </Chip>
                  ))}
                </Flex>
              </Chip.Group>
            </Flex>
          </SimpleGrid>
        </Card>

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
