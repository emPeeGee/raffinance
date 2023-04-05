import React, { useEffect } from 'react';

import { Container, createStyles, rem } from '@mantine/core';
import { Route, Routes } from 'react-router-dom';

import { useCategoriesStore } from 'store';

import { CategoriesList } from '../CategoriesList/CategoriesList';
import { CategoryForm } from '../CategoryForm/CategoryForm';

// TODO: Breadcrumbs ???

const useStyles = createStyles(() => ({
  root: {
    paddingTop: rem(120),
    paddingBottom: rem(120)
  }
}));

export function Categories() {
  const { classes } = useStyles();
  const { getCategories } = useCategoriesStore();

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Container className={classes.root}>
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
