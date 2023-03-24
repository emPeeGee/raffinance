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
  IconSwitchHorizontal
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
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
  active?: boolean;
  onClick?(): void;
}

// TODO: not responsible at all
export function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
        <Icon size="1.2rem" stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: 'Home' },
  { icon: IconGauge, label: 'Dashboard' },
  { icon: IconDeviceDesktopAnalytics, label: 'Analytics' },
  { icon: IconCalendarStats, label: 'Releases' },
  { icon: IconUser, label: 'Account' },
  { icon: IconFingerprint, label: 'Security' },
  { icon: IconSettings, label: 'Settings' }
];

export function Navbar() {
  const [active, setActive] = useState(2);
  const { classes, theme } = useStyles();
  const navigate = useNavigate();
  const { logout } = useContext(UserContext);

  const links = mockdata.map((link, index) => (
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
        <Logo onlyIcon color={theme.white} />
      </Center>
      <MantineNavbar.Section grow mt={50}>
        <Stack justify="center" spacing={0}>
          {links}
        </Stack>
      </MantineNavbar.Section>
      <MantineNavbar.Section>
        <Stack justify="center" spacing={0}>
          <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
          <NavbarLink icon={IconLogout} label="Logout" onClick={logoutUser} />
        </Stack>
      </MantineNavbar.Section>
    </MantineNavbar>
  );
}
