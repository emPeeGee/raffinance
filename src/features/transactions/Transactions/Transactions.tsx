import React, { useEffect } from 'react';

import { Container } from '@mantine/core';
import { Route, Routes } from 'react-router-dom';

import { useTransactionStore } from 'store';

import { TransactionDetails } from '../TransactionDetails/TransactionsDetails';
import { TransactionForm } from '../TransactionForm/TransactionForm';
import { TransactionsDashboard } from '../TransactionsDashboard/TransactionsDashboard';

export function Transactions() {
  const { getTransactions } = useTransactionStore();

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <Container my="xl">
      <Routes>
        <Route path="/" element={<TransactionsDashboard />} />
        <Route path="/:id" element={<TransactionDetails />} />
        <Route path="/create" element={<TransactionForm />} />
        <Route path="/:id/edit" element={<TransactionForm />} />
      </Routes>
    </Container>
  );
}
