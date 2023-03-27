import React from 'react';

import { Group, Button, SegmentedControl } from '@mantine/core';
import { IconFileExport } from '@tabler/icons-react';
import { useIntl } from 'react-intl';

import { ViewMode } from '../accounts.model';
import { useAccountStore } from '../store';

export function AccountViewSwitcher() {
  const { viewMode, setViewMode } = useAccountStore();
  const { formatMessage } = useIntl();

  return (
    <Group w="100%" position="apart" align="center" py="1rem">
      <SegmentedControl
        fullWidth
        value={viewMode}
        onChange={(value: ViewMode) => setViewMode(value)}
        data={[
          { label: formatMessage({ id: 'co-table' }), value: 'table' },
          { label: formatMessage({ id: 'co-card' }), value: 'card' }
        ]}
      />

      <Button size="sm" variant="outline" leftIcon={<IconFileExport />}>
        {formatMessage({ id: 'co-exp-csv' })}
      </Button>
    </Group>
  );
}
