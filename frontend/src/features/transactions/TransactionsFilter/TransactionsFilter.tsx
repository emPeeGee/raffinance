import React from 'react';

import {
  Accordion,
  ActionIcon,
  Box,
  Button,
  Card,
  Group,
  SimpleGrid,
  Text,
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

import { MultiPicker, TransactionTypePicker } from 'components';
import { useAccountStore, useCategoriesStore, useI18nStore, useTagsStore } from 'store';
import { MAX_AVAILABLE_DATE, MIN_AVAILABLE_DATE, getDateRangeText } from 'utils';

import { TransactionFilterModel, TransactionTypeWithAll } from '../transactions.model';

const zeroFilters: TransactionFilterModel = {
  dateRange: [null, null],
  accounts: [],
  categories: [],
  tags: [],
  type: String(TransactionTypeWithAll.ALL),
  description: ''
};

interface Props {
  withAccount?: boolean;
  withTitle?: boolean;
  onApply: (aa: TransactionFilterModel) => void;
  onClear: () => void;
  defaultFilters?: Partial<TransactionFilterModel>;
  defaultExpanded?: boolean;
}

export function TransactionsFilter({
  withAccount = false,
  withTitle = false,
  onApply,
  onClear,
  defaultExpanded = false,
  defaultFilters = undefined
}: Props) {
  const { formatMessage } = useIntl();
  const defaultValues = {
    ...zeroFilters,
    ...defaultFilters
  };
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isDirty, isValid }
  } = useForm<TransactionFilterModel>({
    mode: 'onChange',
    defaultValues
  });
  const { accounts } = useAccountStore();
  const { categories } = useCategoriesStore();
  const { tags } = useTagsStore();
  const { locale } = useI18nStore();
  const theme = useMantineTheme();
  const range = watch('dateRange');
  const accordionName = 'filters';

  const applyFilters = (filters: TransactionFilterModel) => {
    onApply({
      ...filters,
      type: filters.type === String(TransactionTypeWithAll.ALL) ? '' : filters.type
    });
  };

  const clearAll = () => {
    reset({ ...defaultValues });
    onClear();
  };

  return (
    <Box mb="lg">
      <Accordion
        variant="filled"
        my="md"
        defaultValue={defaultExpanded ? accordionName : undefined}>
        <Accordion.Item value={accordionName}>
          <Accordion.Control icon={<IconFilter />}>
            {formatMessage({ id: 'co-filters' })}
            {withTitle && (
              <Text inline color="blue">
                {getDateRangeText(range, formatMessage)}
              </Text>
            )}
          </Accordion.Control>
          <Accordion.Panel>
            <Card mb="lg" withBorder radius="md">
              <Group position="apart" mb="md">
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <TransactionTypePicker {...field} withAll />}
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
                      numberOfColumns={3}
                      defaultDate={new Date()}
                      locale={locale.value}
                      minDate={MIN_AVAILABLE_DATE}
                      maxDate={MAX_AVAILABLE_DATE}
                    />
                  )}
                />
              </Group>
            </Card>

            <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'md', cols: 1, spacing: 40 }]}>
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

              {withAccount && (
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
              )}
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
          disabled={!isValid}
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
