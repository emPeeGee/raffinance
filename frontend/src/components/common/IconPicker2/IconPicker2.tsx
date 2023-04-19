import React, { forwardRef, useEffect, useState } from 'react';

import {
  Box,
  CloseButton,
  Flex,
  Group,
  Input,
  Paper,
  Popover,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  createStyles,
  rem
} from '@mantine/core';
import { useIntl } from 'react-intl';

import { useFirstRender } from 'hooks';
import { ICONS, Icon } from 'utils';

import { Iconify } from '../Iconify/Iconify';

const useStyles = createStyles((theme) => ({
  error: {
    fontSize: rem(14),
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.colors.red[6]
  }
}));

interface Props {
  label: string;
  description?: string;
  withItemLabel?: boolean;
  singlePick?: boolean;
  required?: boolean;
  error?: React.ReactNode;
  onChange: (values: string[]) => void;
  value?: string[];
}

// TODO: controlled for now
// NOTE: Overall I think this component is very ugly designed, but it does the job
// especially, the selected type

// TODO: search functionality and default label co-icon
function Picker(
  {
    label,
    value,
    description,
    error,
    withItemLabel = false,
    required = false,
    singlePick = false,
    onChange
  }: Props,
  ref: React.Ref<any>
) {
  const [selected, setSelected] = useState<string[] | undefined>(value);
  const { classes, theme } = useStyles();
  const isFirstRender = useFirstRender();

  useEffect(() => {
    if (isFirstRender) {
      return;
    }

    onChange(selected ?? []);
  }, [selected]);

  const onSelectHandler = (item: Icon) => {
    if (singlePick) {
      setSelected([item.value]);
    } else {
      setSelected((prev) => [...(prev ?? []), item.value]);
    }
  };

  const onDeleteHandler = (e: any, item: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected((prev) => prev?.filter((icon) => icon !== item));
  };

  return (
    <Box>
      <Input.Wrapper
        ref={ref}
        label={label}
        description={description}
        size="md"
        required={required}
        __staticSelector="ColorInput"
        h="100%">
        <Popover zIndex={9999} withArrow shadow="md">
          <Popover.Target>
            <Box>
              <Input<'div'>
                __staticSelector="MultiSelect"
                style={{ overflow: 'hidden', display: 'flex' }}
                component="div"
                error={error}
                multiline>
                <Group h="100%" py="0.4rem" position="left" align="center">
                  {selected?.map((icon) => (
                    <Paper key={icon} p={4} withBorder>
                      <Flex gap="xs">
                        <Iconify icon={icon} color={theme.colors[theme.primaryColor][6]} />
                        {withItemLabel && <Text>{ICONS.find((i) => i.value === icon)?.label}</Text>}
                        <CloseButton onClick={(e) => onDeleteHandler(e, icon)} />
                      </Flex>
                    </Paper>
                  ))}
                </Group>
              </Input>
              {error && <Box className={classes.error}>{error}</Box>}
            </Box>
          </Popover.Target>
          <Popover.Dropdown>
            <ScrollArea w={370} h={300}>
              <Box>
                <SimpleGrid cols={6}>
                  {ICONS.filter((icon) => !selected?.includes(icon.value)).map((icon) => (
                    <ThemeIcon
                      size="3rem"
                      radius="md"
                      key={icon.value}
                      variant="light"
                      style={{ cursor: 'pointer' }}
                      onClick={() => onSelectHandler(icon)}>
                      <Iconify icon={icon.value} />
                    </ThemeIcon>
                  ))}
                </SimpleGrid>
              </Box>
            </ScrollArea>
          </Popover.Dropdown>
        </Popover>
      </Input.Wrapper>
    </Box>
  );
}

export const IconPicker2 = forwardRef(Picker);
