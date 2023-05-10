import React, { forwardRef } from 'react';

import {
  MultiSelect,
  Box,
  CloseButton,
  SelectItemProps,
  MultiSelectValueProps,
  rem,
  Flex,
  Group,
  MantineSize,
  MultiSelectProps,
  ColorSwatch
} from '@mantine/core';

import { getContrastColor, noop } from 'utils';

import { Iconify } from '../Iconify/Iconify';

// TODO: mess in code, extract types

function Value({
  value,
  label,
  icon,
  color,
  onRemove,
  classNames,
  ...others
}: MultiSelectValueProps & { icon?: string; value: string; color: string }) {
  return (
    <div {...others}>
      <Group
        my={4}
        align="center"
        spacing="xs"
        position="left"
        pl="xs"
        sx={(theme) => ({
          backgroundColor: color,
          color: getContrastColor(color),
          borderRadius: theme.radius.sm
        })}>
        {icon && <Iconify size="1.25rem" icon={icon} />}
        <Box sx={{ lineHeight: 1, fontSize: rem(12), fontWeight: 700 }}>{label}</Box>
        <CloseButton
          onMouseDown={onRemove}
          variant="transparent"
          c={getContrastColor(color)}
          size={22}
          iconSize={14}
        />
      </Group>
    </div>
  );
}

// eslint-disable-next-line react/display-name
const Item = forwardRef<
  HTMLDivElement,
  SelectItemProps & { icon?: string; color: string; value: string }
>(({ label, value, color, icon, ...others }, ref) => {
  return (
    <div ref={ref} {...others}>
      <Flex align="center" gap="sm">
        {icon && (
          <Box mr={10}>
            <Iconify icon={icon} />
          </Box>
        )}
        <div>{label}</div>
        <ColorSwatch color={color} />
      </Flex>
    </div>
  );
});

interface Props extends MultiSelectProps {
  label: string;
  size?: MantineSize;
  data: { label: string; value: string; icon?: string }[];
}

// No need for all of these
function MultipleSelect(
  { data, label, description, maxSelectedValues, onChange, size = 'md', ...props }: Props,
  ref: React.Ref<any>
) {
  return (
    <MultiSelect
      {...props}
      ref={ref}
      onChange={onChange}
      description={description}
      data={data}
      limit={20}
      size={size}
      multiple={false}
      maxSelectedValues={maxSelectedValues}
      valueComponent={Value}
      itemComponent={Item}
      searchable
      clearable
      label={label}
    />
  );
}

export const MultiPicker = forwardRef(MultipleSelect);
