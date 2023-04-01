import React, { forwardRef } from 'react';

import {
  MultiSelect,
  Box,
  CloseButton,
  SelectItemProps,
  MultiSelectValueProps,
  rem,
  Flex,
  Group
} from '@mantine/core';

import { getContrastColor } from 'utils';

import { Iconify } from '../Iconify/Iconify';

function Value({
  value,
  label,
  icon,
  color,
  onRemove,
  classNames,
  ...others
}: MultiSelectValueProps & { icon: string; value: string; color: string }) {
  return (
    <div {...others}>
      <Group
        my={4}
        py={4}
        align="center"
        spacing="xs"
        position="left"
        pl="xs"
        sx={(theme) => ({
          backgroundColor: color,
          color: getContrastColor(color),
          borderRadius: theme.radius.sm
        })}>
        <Iconify size="1.25rem" icon={icon} />
        <Box sx={{ lineHeight: 1, fontSize: rem(12) }}>{label}</Box>
        <CloseButton onMouseDown={onRemove} variant="transparent" size={22} iconSize={14} />
      </Group>
    </div>
  );
}

// eslint-disable-next-line react/display-name
const Item = forwardRef<HTMLDivElement, SelectItemProps & { icon: string; value: string }>(
  ({ label, value, icon, ...others }, ref) => {
    return (
      <div ref={ref} {...others}>
        <Flex align="center">
          <Box mr={10}>
            <Iconify icon={icon} />
          </Box>
          <div>{label}</div>
        </Flex>
      </div>
    );
  }
);

interface Props {
  label: string;
  data: { label: string; value: string; icon?: string }[];
}

export function MultiPicker({ data, label }: Props) {
  return (
    <MultiSelect
      data={data}
      limit={20}
      valueComponent={Value}
      itemComponent={Item}
      searchable
      clearable
      label={label}
    />
  );
}
