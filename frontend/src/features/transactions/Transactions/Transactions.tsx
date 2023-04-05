import React, { useEffect } from 'react';

import { Container, createStyles, rem } from '@mantine/core';
import { Route, Routes } from 'react-router-dom';

import { useTransactionStore } from 'store';

import { TransactionCreate } from '../TransactionCreate/TransactionCreate';
import { TransactionDetails } from '../TransactionDetails/TransactionsDetails';
import { TransactionsDashboard } from '../TransactionsDashboard/TransactionsDashboard';

// TODO: Breadcrumbs ???

const useStyles = createStyles(() => ({
  root: {
    paddingTop: rem(120),
    paddingBottom: rem(120)
  }
}));

export function Transactions() {
  const { classes } = useStyles();
  const { getTransactions } = useTransactionStore();

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <Container className={classes.root}>
      <Routes>
        <Route path="/" element={<TransactionsDashboard />} />
        <Route path="/:id" element={<TransactionDetails />} />
        <Route path="/create" element={<TransactionCreate />} />
        <Route path="/:id/edit" element={<TransactionCreate />} />
      </Routes>
    </Container>
  );
}

// TODO: suspense for base fetch ?, effects and routes reorganization
// TODO: components organization, do i need folder for each component?
