import React from 'react';

import { Anchor, Container, Flex, Group, Text, createStyles, rem } from '@mantine/core';
import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from '@tabler/icons-react';
import { FormattedMessage } from 'react-intl';

import Logo from '../Logo/Logo';

const useStyles = createStyles((theme) => ({
  footer: {
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
    paddingBottom: `calc(${theme.spacing.xl} * 2)`,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`
  },

  logo: {
    maxWidth: rem(200),

    [theme.fn.smallerThan('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  },

  description: {
    marginTop: rem(5),

    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xs,
      textAlign: 'center'
    }
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
      alignItems: 'center'
    }
  },

  wrapper: {
    width: rem(160)
  },

  link: {
    display: 'block',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
    fontSize: theme.fontSizes.sm,
    paddingTop: rem(3),
    paddingBottom: rem(3),

    '&:hover': {
      textDecoration: 'underline'
    }
  },

  afterFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column'
    }
  },

  social: {
    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xs
    }
  }
}));

export function Footer() {
  const { classes } = useStyles();

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <Group position="apart" sx={{ width: '100%' }}>
          <div className={classes.logo}>
            <Logo />
          </div>
          <div>
            <Text size="xs" color="dimmed" className={classes.description}>
              <FormattedMessage id="co-bloom" />
            </Text>
          </div>
        </Group>
      </Container>
      <Container className={classes.afterFooter}>
        <Flex direction="column" gap={4}>
          <Text color="dimmed" size="sm">
            <FormattedMessage id="co-rights" />
          </Text>
          <Text color="dimmed" size="xs">
            <FormattedMessage
              id="co-build"
              values={{
                author: (
                  <Anchor href="https://github.com/emPeeGee" target="_blank">
                    emPeeGee
                  </Anchor>
                )
              }}
            />
          </Text>
        </Flex>

        <Group spacing={0} className={classes.social} position="right" noWrap>
          <Anchor p="sm" size="lg" href="https://github.com/emPeeGee/raffinance" target="_blank">
            <IconBrandTwitter size="1.05rem" stroke={1.5} />
          </Anchor>
          <Anchor p="sm" size="lg" href="https://github.com/emPeeGee/raffinance" target="_blank">
            <IconBrandYoutube size="1.05rem" stroke={1.5} />
          </Anchor>
          <Anchor p="sm" size="lg" href="https://github.com/emPeeGee/raffinance" target="_blank">
            <IconBrandInstagram size="1.05rem" stroke={1.5} />
          </Anchor>
        </Group>
      </Container>
    </footer>
  );
}
