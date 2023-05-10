import React, { useState } from 'react';

import { Group, Button, SegmentedControl } from '@mantine/core';
import { IconFileExport } from '@tabler/icons-react';
import { useIntl } from 'react-intl';

import { ViewMode } from 'utils';

interface Props {
  defaultValue: ViewMode;
  onChange: (viewMode: ViewMode) => void;
}

export function ViewSwitcher({ defaultValue, onChange }: Props) {
  const { formatMessage } = useIntl();
  const [viewMode, setViewMode] = useState<ViewMode>(defaultValue);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    onChange(mode);
  };

  return (
    <Group w="100%" position="apart" align="center" py="1rem">
      <SegmentedControl
        fullWidth
        value={viewMode}
        onChange={(value: ViewMode) => handleViewModeChange(value)}
        data={[
          { label: formatMessage({ id: 'co-table' }), value: 'table' },
          { label: formatMessage({ id: 'co-card' }), value: 'card' }
        ]}
      />

      {/* // TODO */}
      {/* <Button size="sm" variant="outline" leftIcon={<IconFileExport />}>
        {formatMessage({ id: 'co-exp-csv' })}
      </Button> */}
    </Group>
  );
}
