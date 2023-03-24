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
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconCalendarStats,
  IconUser,
  IconSettings,
  IconLogout,
  IconSwitchHorizontal,
  IconCategory2,
  IconHash,
  IconAddressBook,
  IconExchange,
  IconWallet,
  IconRocket
} from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from 'features/authentication';
import { Logo } from '../..';

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
export function NavbarLink({ icon: Icon, route, label, active, onClick }: NavbarLinkProps) {
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
  // { icon: IconHome2, label: 'Home' },
  { icon: IconGauge, label: 'Dashboard', route: '/' },
  { icon: IconWallet, label: 'Accounts', route: '/' },
  { icon: IconExchange, label: 'Transactions', route: '/' },
  { icon: IconCategory2, label: 'Categories', route: '/' },
  { icon: IconHash, label: 'Tags', route: '/' },
  { icon: IconAddressBook, label: 'Contacts', route: '/' },
  { icon: IconUser, label: 'User profile', route: '/profile' },
  { icon: IconRocket, label: 'User profile', route: '/profile' }
];

export function Navbar() {
  const [active, setActive] = useState(2);
  const { classes, theme } = useStyles();
  const navigate = useNavigate();
  const { logout } = useContext(UserContext);

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
    navigate(`/`, {
      replace: true
    });
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
          <NavbarLink icon={IconLogout} label="Logout" onClick={logoutUser} />
        </Stack>
      </MantineNavbar.Section>
    </MantineNavbar>
  );
}
