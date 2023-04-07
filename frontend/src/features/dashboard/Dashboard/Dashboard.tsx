import React from 'react';

import { Button, Container, Group, Title, createStyles, rem, Card, Box, Text } from '@mantine/core';
import {
  IconRocket,
  IconCircle,
  IconSquare,
  IconTriangle,
  IconPentagon
} from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { useAuthStore } from 'store';
import { getRandomNumber } from 'utils';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(120),
    paddingBottom: rem(120)
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

export function Dashboard() {
  const { formatMessage } = useIntl();
  const { classes } = useStyles();
  const { user } = useAuthStore();

  const randomGreeting = formatMessage(
    { id: `dsh-greeting-${getRandomNumber(1, 22)}` },
    { name: user?.name }
  );

  return (
    <Container my="xl">
      <Box py="sm">
        <Title className={classes.title}>Dashboard</Title>
        <Text mb="sm" c="dimmed" size="lg">
          {randomGreeting}
        </Text>

        <Card withBorder radius="md">
          <Title order={4} mb="md">
            <Group>
              <IconRocket color="gray" />
              {formatMessage({ id: 'co-quick-act' })}
            </Group>
          </Title>
          <Group>
            {/* NOTE: // Every entity has a associated shape and color */}
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
      </Box>
    </Container>
  );
}

// TODO: Create a comp, EntityCreateButton which will have all entities predefined and will avoid duplication
