import React, { useEffect } from 'react';

import { Container } from '@mantine/core';
import { Route, Routes } from 'react-router-dom';

import { useTagsStore } from 'store';

import { TagForm } from '../TagForm/TagForm';
import { TagsList } from '../TagsList/TagsList';

// TODO: Breadcrumbs ???

export function Tags() {
  const { getTags } = useTagsStore();

  useEffect(() => {
    getTags();
  }, []);

  return (
    <Container my="xl">
      <Routes>
        <Route path="/" element={<TagsList />} />
        <Route path="/create" element={<TagForm />} />
        <Route path="/:id/edit" element={<TagForm />} />
      </Routes>
    </Container>
  );
}

// TODO: suspense for base fetch ?, effects and routes reorganization
// TODO: components organization, do i need folder for each component?
