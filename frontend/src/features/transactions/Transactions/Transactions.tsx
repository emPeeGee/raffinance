import React, { useEffect } from 'react';

import { Container, createStyles, rem } from '@mantine/core';
import { Route, Routes } from 'react-router-dom';

// import { useTransactionsStore } from 'store';

import { useTransactionStore } from 'store';

import { TransactionsDashboard } from '../TransactionsDashboard/TransactionsDashboard';
import { TransactionsList } from '../TransactionsList/TransactionsList';

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
        {/* <Route path="/create" element={<CategoryCreate />} />
        <Route path="/:id/edit" element={<CategoryCreate />} /> */}
      </Routes>
    </Container>
  );
}

// TODO: suspense for base fetch ?, effects and routes reorganization
// TODO: components organization, do i need folder for each component?
