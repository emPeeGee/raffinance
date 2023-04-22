import React, { useEffect } from 'react';

import { Container } from '@mantine/core';
import { Route, Routes } from 'react-router-dom';

import { useAccountStore } from 'store';

import { AccountDetail } from '../AccountDetail/AccountDetail';
import { AccountForm } from '../AccountForm/AccountForm';
import { AccountsDashboard } from '../AccountsDashboard/AccountsDashboard';

// TODO: Breadcrumbs ???

export function Accounts() {
  const { getAccounts } = useAccountStore();

  useEffect(() => {
    getAccounts();
  }, []);

  return (
    <Container my="xl">
      <Routes>
        <Route path="/" element={<AccountsDashboard />} />
        <Route path="/:id" element={<AccountDetail />} />
        <Route path="/create" element={<AccountForm />} />
        <Route path="/:id/edit" element={<AccountForm />} />
      </Routes>
    </Container>
  );
}
