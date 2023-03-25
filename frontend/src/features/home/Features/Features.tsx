import React from 'react';

import {
  createStyles,
  Badge,
  Group,
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
  rem
} from '@mantine/core';
import { IconGauge, IconUser, IconCookie } from '@tabler/icons-react';

const features = [
  {
    title: 'Financial Account Management',
    description:
      'It allows users to manage multiple financial accounts in one place, including tracking their balances and transactions.',
    icon: IconGauge
  },
  {
    title: 'Budgeting and Expense Tracking',
    description:
      'It provides tools for creating and managing budgets, as well as tracking expenses by category or tag',
    icon: IconUser
  },
  {
    title: 'Loan Management',
    description:
      'It includes features for managing loans, including tracking loan amounts, repayment dates, and payments made.',
    icon: IconCookie
  },
  {
    title: 'Goal Tracking',
    description:
      'The app allows users to set financial goals and track their progress toward achieving them, with features such as goal amount, start and end dates, and ongoing status updates.',
    icon: IconCookie
  }
];

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(34),
    fontWeight: 900,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(24)
    }
  },

  description: {
    maxWidth: 600,
    margin: 'auto',

    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },

  card: {
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
    }`
  },

  cardTitle: {
    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm
    }
  }
}));

// TODO: Complete it with images if needed and check
export function Features() {
  const { classes, theme } = useStyles();
  const featuresCards = features.map((feature) => (
    <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
      <feature.icon size={rem(50)} stroke={2} color={theme.fn.primaryColor()} />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <Container size="lg" py="xl">
      <Group position="center">
        <Badge variant="filled" size="lg">
          Best application ever
        </Badge>
      </Group>

      <Title order={2} className={classes.title} ta="center" mt="sm">
        Bloom your finances with money tracking app
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        Every once in a while, you’ll see a Golbat that’s missing some fangs. This happens when
        hunger drives it to try biting a Steel-type Pokémon.
      </Text>

      <SimpleGrid cols={3} spacing="xl" mt={50} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
        {featuresCards}
      </SimpleGrid>
    </Container>
  );
}
