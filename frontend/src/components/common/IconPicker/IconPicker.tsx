import React, { forwardRef } from 'react';

import { Group, Select, SelectProps, Text } from '@mantine/core';
import { useIntl } from 'react-intl';

import { ICONS } from 'utils';

import { Iconify } from '../Iconify/Iconify';

interface SelectItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  value: string;
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ label, value, ...others }: SelectItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Iconify icon={value} />
        <Text size="sm">{label}</Text>
      </Group>
    </div>
  )
);
// TODO: ugly
SelectItem.displayName = 'SelectItem';

interface Props extends Omit<SelectProps, 'data' | 'value'> {}

/**
 * @deprecated The method should not be used
 */
export function IconPicker({ ...props }: Props) {
  const { formatMessage } = useIntl();

  return (
    <Select
      {...props}
      label={formatMessage({ id: 'co-icon' })}
      nothingFound={formatMessage({ id: 'co-no-opts' })}
      searchable
      clearable
      required
      allowDeselect
      size="md"
      // icon={<Iconify icon={field.value} />}
      itemComponent={SelectItem}
      data={ICONS}
      filter={(value: string, item: SelectItemProps) =>
        item.label.toLowerCase().includes(value.toLowerCase().trim())
      }
    />
  );
}
