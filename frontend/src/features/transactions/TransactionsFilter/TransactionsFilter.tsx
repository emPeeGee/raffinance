import React from 'react';

import 'dayjs/locale/ru';
import 'dayjs/locale/ro';

import {
  Accordion,
  ActionIcon,
  Box,
  Button,
  Card,
  Group,
  LoadingOverlay,
  SegmentedControl,
  SimpleGrid,
  TextInput,
  useMantineTheme
} from '@mantine/core';
import { MonthPicker } from '@mantine/dates';
import {
  IconArrowLeft,
  IconArrowRight,
  IconCardboards,
  IconClearAll,
  IconFilter,
  IconSearch
} from '@tabler/icons-react';
import { Controller, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';

import { MultiPicker } from 'components';
import {
  useAccountStore,
  useCategoriesStore,
  useI18nStore,
  useTagsStore,
  useTransactionStore
} from 'store';

import { TransactionFilterModel, TransactionType } from '../transactions.model';

const defaultFilters: TransactionFilterModel = {
  dateRange: [new Date(), new Date()],
  accounts: [],
  categories: [],
  tags: [],
  type: '',
  description: ''
};

export function TransactionsFilter() {
  const { formatMessage } = useIntl();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isValid }
  } = useForm<TransactionFilterModel>({
    mode: 'onChange',
    defaultValues: { ...defaultFilters }
  });
  const { accounts } = useAccountStore();
  const { categories } = useCategoriesStore();
  const { tags } = useTagsStore();
  const { pending, fetchTransactions } = useTransactionStore();
  const { locale } = useI18nStore();
  const theme = useMantineTheme();

  const applyFilters = (filters: TransactionFilterModel) => {
    fetchTransactions(filters);
  };

  const clearAll = () => {
    reset({ ...defaultFilters });
    fetchTransactions();
  };

  return (
    <Box mb="lg">
      <LoadingOverlay visible={pending} />
      <Accordion variant="filled" my="md">
        <Accordion.Item value="filters">
          <Accordion.Control icon={<IconFilter />}>
            {formatMessage({ id: 'co-filters' })}
          </Accordion.Control>
          <Accordion.Panel>
            <Card my="lg" withBorder radius="md">
              <Group position="apart" mb="md">
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <SegmentedControl
                      {...field}
                      data={[
                        { label: formatMessage({ id: 'co-all' }), value: '' },
                        {
                          label: formatMessage({ id: 'co-incs' }),
                          value: String(TransactionType.INCOME)
                        },
                        {
                          label: formatMessage({ id: 'co-exps' }),
                          value: String(TransactionType.EXPENSE)
                        },
                        {
                          label: formatMessage({ id: 'co-tras' }),
                          value: String(TransactionType.TRANSFER)
                        }
                      ]}
                    />
                  )}
                />
              </Group>

              <Group position="center">
                <Controller
                  name="dateRange"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <MonthPicker
                      {...field}
                      type="range"
                      allowSingleDateInRange
                      numberOfColumns={3}
                      defaultDate={new Date()}
                      locale={locale.value}
                      // TODO: Hard code
                      minDate={new Date(2010, 1, 1)}
                      maxDate={new Date(2029, 1, 1)}
                    />
                  )}
                />
              </Group>
            </Card>

            <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'md', cols: 1, spacing: 40 }]}>
              <Controller
                name="accounts"
                control={control}
                render={({ field }) => (
                  <MultiPicker
                    {...field}
                    label={formatMessage({ id: 'acc' })}
                    data={accounts.map((a) => ({
                      label: a.name,
                      value: String(a.id),
                      icon: a.icon,
                      color: a.color
                    }))}
                  />
                )}
              />
              <Controller
                name="categories"
                control={control}
                render={({ field }) => (
                  <MultiPicker
                    {...field}
                    label={formatMessage({ id: 'cat-categ' })}
                    data={categories.map((c) => ({
                      label: c.name,
                      value: String(c.id),
                      icon: c.icon,
                      color: c.color
                    }))}
                  />
                )}
              />

              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <MultiPicker
                    {...field}
                    label={formatMessage({ id: 'tag-tag' })}
                    data={tags.map((t) => ({
                      label: t.name,
                      value: String(t.id),
                      icon: t.icon,
                      color: t.color
                    }))}
                  />
                )}
              />
            </SimpleGrid>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <TextInput
        {...register('description', {
          required: false,
          maxLength: 100,
          value: ''
        })}
        icon={<IconSearch size="1.1rem" stroke={1.5} />}
        radius="xl"
        size="md"
        mb="md"
        rightSection={
          <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled">
            {theme.dir === 'ltr' ? (
              <IconArrowRight size="1.1rem" stroke={1.5} />
            ) : (
              <IconArrowLeft size="1.1rem" stroke={1.5} />
            )}
          </ActionIcon>
        }
        placeholder={formatMessage({ id: 'txn-search' })}
        rightSectionWidth={42}
      />

      <Group spacing="md">
        <Button
          variant="light"
          color="blue"
          disabled={!isDirty || !isValid}
          leftIcon={<IconCardboards />}
          onClick={handleSubmit(applyFilters)}>
          {formatMessage({ id: 'co-apply' })}
        </Button>

        <Button
          variant="outline"
          color="gray"
          disabled={!isDirty}
          leftIcon={<IconClearAll />}
          onClick={clearAll}>
          {formatMessage({ id: 'co-clear-all' })}
        </Button>
      </Group>
    </Box>
  );
}
