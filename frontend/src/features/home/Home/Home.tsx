import React from 'react';

import { createStyles, Container, Text, Button, Group, rem } from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { Features, UseCases } from '..';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    boxSizing: 'border-box',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white
  },

  inner: {
    position: 'relative',
    paddingTop: rem(200),
    paddingBottom: rem(120),

    [theme.fn.smallerThan('sm')]: {
      paddingBottom: rem(80),
      paddingTop: rem(80)
    }
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(62),
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(42),
      lineHeight: 1.2
    }
  },

  description: {
    marginTop: theme.spacing.xl,
    fontSize: rem(24),

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(18)
    }
  },

  controls: {
    marginTop: `calc(${theme.spacing.xl} * 2)`,

    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xl
    }
  },

  control: {
    height: rem(54),
    paddingLeft: rem(38),
    paddingRight: rem(38),

    [theme.fn.smallerThan('sm')]: {
      height: rem(54),
      paddingLeft: rem(18),
      paddingRight: rem(18),
      flex: 1
    }
  }
}));

export function Home() {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <Container size={700} className={classes.inner}>
        <h1 className={classes.title}>
          <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit>
            Your Partner
          </Text>{' '}
          in Financial Health
        </h1>

        <Text className={classes.description} color="dimmed">
          The ultimate money management app. It allows you to easily track your income, expenses,
          transfers, and more, all in one place. With customizable components, Raffinace is fully
          featured and accessible for all users. Simplify your finances and achieve your financial
          goals
        </Text>

        <Group className={classes.controls}>
          <Button
            component={Link}
            to="sign-in"
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}>
            Get started
          </Button>

          <Button
            component="a"
            href="https://github.com/emPeeGee/raffinance"
            target="_blank"
            size="xl"
            variant="default"
            className={classes.control}
            leftIcon={<IconBrandGithub size={20} />}>
            GitHub
          </Button>
        </Group>
      </Container>
      <Features />
      <UseCases />
    </div>
  );
}
