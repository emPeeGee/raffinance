import React from 'react';
import { Group, Text, createStyles, rem } from '@mantine/core';
import { Link } from 'react-router-dom';

import { ReactComponent as Rafflesia } from 'assets/rafflesia2.svg';

const useStyles = createStyles((theme) => ({
  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(0)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    [theme.fn.smallerThan('sm')]: {
      height: rem(42),
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    }
  }
}));

function Logo() {
  const { classes, theme } = useStyles();

  return (
    <Link to="/" className={classes.link}>
      <Group spacing={6}>
        <div style={{ width: '40px', height: '40px' }}>
          <Rafflesia fill={theme.colors.blue[6]} width="100%" height="100%" stroke="green" />
        </div>
        <Text
          variant="gradient"
          gradient={{ from: theme.colors.blue[9], to: 'cyan', deg: 45 }}
          sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
          ta="center"
          fz="xl"
          fw={700}>
          Raffinance
        </Text>
      </Group>
    </Link>
  );
}

export { Logo };
