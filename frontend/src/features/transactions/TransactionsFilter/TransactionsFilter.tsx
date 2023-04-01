import React, { useState } from 'react';

import { Accordion, Button, Card, Group, SegmentedControl, SimpleGrid } from '@mantine/core';
import { MonthPicker } from '@mantine/dates';
import { IconFilter } from '@tabler/icons-react';
import { useIntl } from 'react-intl';

import { MultiPicker } from 'components';
import { useCategoriesStore, useTagsStore } from 'store';

export function TransactionsFilter() {
  const { formatMessage } = useIntl();

  const [month, setMonth] = useState<Date | null>(null);
  const { categories } = useCategoriesStore();
  const { tags: allTags } = useTagsStore();

  return (
    <Accordion variant="filled" my="md">
      <Accordion.Item value="filters">
        <Accordion.Control icon={<IconFilter />}>
          {formatMessage({ id: 'co-filters' })}
        </Accordion.Control>
        <Accordion.Panel>
          <Card my="lg" withBorder radius="md">
            <Group position="apart" mb="md">
              <SegmentedControl
                value="all"
                // onChange={(value: ViewMode) => setViewMode(value)}
                data={[
                  { label: formatMessage({ id: 'co-all' }), value: 'all' },
                  { label: formatMessage({ id: 'co-incs' }), value: 'table' },
                  { label: formatMessage({ id: 'co-exps' }), value: 'ex' },
                  { label: formatMessage({ id: 'co-tras' }), value: 'card' }
                ]}
              />
            </Group>

            <Group position="center">
              {/* TODO: Move from this component, because it require backend call */}
              <MonthPicker
                value={month}
                onChange={setMonth}
                defaultDate={new Date()}
                minDate={new Date(1910, 1, 1)}
                maxDate={new Date()}
              />
            </Group>
          </Card>

          <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'md', cols: 1, spacing: 40 }]}>
            <MultiPicker
              label={formatMessage({ id: 'cat-categ' })}
              data={categories.map((c) => ({
                label: c.name,
                value: String(c.id),
                icon: c.icon,
                color: c.color
              }))}
            />

            <MultiPicker
              label={formatMessage({ id: 'tag-tag' })}
              data={allTags.map((t) => ({
                label: t.name,
                value: String(t.id),
                icon: t.icon,
                color: t.color
              }))}
            />
          </SimpleGrid>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
