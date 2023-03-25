import React, { useState } from 'react';
import { createStyles, UnstyledButton, Menu, Image, Group, rem } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useI18nStore } from 'store';
import { languages } from 'utils';

const useStyles = createStyles((theme, { opened }: { opened: boolean }) => ({
  control: {
    width: rem(200),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2]
    }`,
    transition: 'background-color 150ms ease',
    backgroundColor:
      // eslint-disable-next-line no-nested-ternary
      theme.colorScheme === 'dark'
        ? theme.colors.dark[opened ? 5 : 6]
        : opened
        ? theme.colors.gray[0]
        : theme.white,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0]
    }
  },

  label: {
    fontWeight: 500,
    fontSize: theme.fontSizes.sm
  },

  icon: {
    transition: 'transform 150ms ease',
    transform: opened ? 'rotate(180deg)' : 'rotate(0deg)'
  }
}));

function LanguagePicker() {
  const { locale, setLocale } = useI18nStore();
  const [opened, setOpened] = useState(false);
  const { classes } = useStyles({ opened });
  // const [selected, setSelected] = useState(languages[0]);

  const items = languages.map((item) => (
    <Menu.Item
      icon={<Image src={item.image} width={18} height={18} />}
      onClick={() => {
        // setSelected(item);
        setLocale(item);
      }}
      key={item.label}>
      {item.label}
    </Menu.Item>
  ));

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      width="target"
      withinPortal>
      <Menu.Target>
        <UnstyledButton className={classes.control}>
          <Group spacing="xs">
            <Image src={locale.image} width={22} height={22} />
            <span className={classes.label}>{locale.label}</span>
          </Group>
          <IconChevronDown size="1rem" className={classes.icon} stroke={1.5} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}

export default LanguagePicker;
