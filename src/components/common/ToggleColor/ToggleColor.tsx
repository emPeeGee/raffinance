import React from 'react';

import { useMantineColorScheme, Group, Switch, useMantineTheme } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';

export function ToggleColor() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  return (
    <Group position="center">
      <Switch
        checked={colorScheme === 'dark'}
        onChange={() => toggleColorScheme()}
        size="md"
        onLabel={<IconSun color={theme.white} size="1.25rem" stroke={1.5} />}
        offLabel={<IconMoonStars color={theme.colors.gray[6]} size="1.25rem" stroke={1.5} />}
      />
    </Group>
  );
}
