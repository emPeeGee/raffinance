import React, { useContext, useState } from 'react';

import {
  Navbar as MantineNavbar,
  Center,
  Tooltip,
  UnstyledButton,
  createStyles,
  Stack,
  rem
} from '@mantine/core';
import {
  IconGauge,
  IconUser,
  IconSettings,
  IconLogout,
  IconCategory2,
  IconHash,
  IconAddressBook,
  IconExchange,
  IconWallet,
  IconRocket,
  IconSofa
} from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthStore } from 'store';

import Logo from '../Logo/Logo';

// TODO: idk circular dep

const useStyles = createStyles((theme) => ({
  root: {
    position: 'sticky',
    top: 0,
    height: '100vh'
  },
  link: {
    width: rem(50),
    height: rem(50),
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.white,
    opacity: 0.85,

    '&:hover': {
      opacity: 1,
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background!,
        0.1
      )
    }
  },

  active: {
    opacity: 1,
    '&, &:hover': {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background!,
        0.15
      )
    }
  }
}));

interface NavbarLinkProps {
  icon: React.FC<any>;
  label: string;
  route?: string;
  active?: boolean;
  onClick?(): void;
}

// TODO: not responsible at all
function NavbarLink({ icon: Icon, route, label, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      {route ? (
        <UnstyledButton
          component={Link}
          to={route}
          onClick={onClick}
          className={cx(classes.link, { [classes.active]: active })}>
          <Icon size="1.2rem" stroke={1.5} />
        </UnstyledButton>
      ) : (
        <UnstyledButton
          onClick={onClick}
          className={cx(classes.link, { [classes.active]: active })}>
          <Icon size="1.2rem" stroke={1.5} />
        </UnstyledButton>
      )}
    </Tooltip>
  );
}

const navbarLinks = [
  { icon: IconSofa, label: 'Dashboard', route: '/' },
  { icon: IconWallet, label: 'Accounts', route: '/accounts' },
  { icon: IconExchange, label: 'Transactions', route: '/transactions' },
  { icon: IconCategory2, label: 'Categories', route: '/categories' },
  { icon: IconHash, label: 'Tags', route: '/tags' },
  { icon: IconAddressBook, label: 'Contacts', route: '/contacts' },
  { icon: IconUser, label: 'User profile', route: '/profile' }
];

// TODO: string based highlight, not index, for example read from route and match

function Navbar() {
  const [active, setActive] = useState(2);
  const { classes, theme } = useStyles();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const links = navbarLinks.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  const logoutUser = () => {
    logout();
    navigate(`/`);
  };

  return (
    <MantineNavbar
      width={{ base: 80 }}
      p="md"
      className={classes.root}
      sx={(th) => ({
        backgroundColor: th.fn.variant({ variant: 'filled', color: th.primaryColor }).background
      })}>
      <Center>
        <Logo onlyIcon color={theme.white} onClick={() => setActive(0)} />
      </Center>
      <MantineNavbar.Section grow mt={50}>
        <Stack justify="center" spacing={2}>
          {links}
        </Stack>
      </MantineNavbar.Section>
      <MantineNavbar.Section>
        <Stack justify="center" spacing={0}>
          <NavbarLink icon={IconSettings} label="Settings" route="/settings" />
          {/* TODO: dialog confirmation */}
          <NavbarLink icon={IconLogout} label="Logout" onClick={logoutUser} />
        </Stack>
      </MantineNavbar.Section>
    </MantineNavbar>
  );
}

export default Navbar;
