import React from 'react';

import { Container } from '@mantine/core';
import { Route, Routes } from 'react-router-dom';

import { AccountDetail } from '../AccountDetail/AccountDetail';
import { AccountForm } from '../AccountForm/AccountForm';
import { AccountsDashboard } from '../AccountsDashboard/AccountsDashboard';

// TODO: Breadcrumbs ???

export function Accounts() {
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
