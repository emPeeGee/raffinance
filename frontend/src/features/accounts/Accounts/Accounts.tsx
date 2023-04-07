import React, { useEffect } from 'react';

import { Container, createStyles, rem } from '@mantine/core';
import { Route, Routes } from 'react-router-dom';

import { useAccountStore } from 'store';

import { AccountDetail } from '../AccountDetail/AccountDetail';
import { AccountForm } from '../AccountForm/AccountForm';
import { AccountsDashboard } from '../AccountsDashboard/AccountsDashboard';

// TODO: Breadcrumbs ???

const useStyles = createStyles(() => ({
  root: {
    paddingTop: rem(120),
    paddingBottom: rem(120)
  }
}));

export function Accounts() {
  const { classes } = useStyles();
  const { getAccounts } = useAccountStore();

  useEffect(() => {
    getAccounts();
  }, []);

  return (
    <Container className={classes.root}>
      <Routes>
        <Route path="/" element={<AccountsDashboard />} />
        <Route path="/:id" element={<AccountDetail />} />
        <Route path="/create" element={<AccountForm />} />
        <Route path="/:id/edit" element={<AccountForm />} />
      </Routes>
    </Container>
  );
}
