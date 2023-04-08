import React, { useEffect } from 'react';

import { Container } from '@mantine/core';
import { Route, Routes } from 'react-router-dom';

import { useCategoriesStore } from 'store';

import { CategoriesList } from '../CategoriesList/CategoriesList';
import { CategoryForm } from '../CategoryForm/CategoryForm';

// TODO: Breadcrumbs ???

export function Categories() {
  const { getCategories } = useCategoriesStore();

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Container my="xl">
      <Routes>
        <Route path="/" element={<CategoriesList />} />
        <Route path="/create" element={<CategoryForm />} />
        <Route path="/:id/edit" element={<CategoryForm />} />
      </Routes>
    </Container>
  );
}

// TODO: suspense for base fetch ?, effects and routes reorganization
// TODO: components organization, do i need folder for each component?
