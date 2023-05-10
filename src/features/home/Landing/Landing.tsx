import React from 'react';

import { Container, createStyles } from '@mantine/core';

import { Features, Home, UseCases } from '..';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    boxSizing: 'border-box',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white
  }
}));
export function Landing() {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <Container>
        <Home />
        <Features />
        <UseCases />
      </Container>
    </div>
  );
}
