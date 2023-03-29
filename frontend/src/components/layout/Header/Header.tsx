import React from 'react';

import {
  createStyles,
  Header as MantineHeader,
  Group,
  Button,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
  Container
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';

import { ToggleColor, LanguagePicker } from 'components';
import { useAuthStore } from 'store';

import Logo from '../Logo/Logo';

const useStyles = createStyles((theme) => ({
  header: {
    position: 'fixed',
    width: '100%',
    height: '60px',
    left: '50%',
    top: '0%',
    marginLeft: '-50%',
    zIndex: 100
  },
  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    [theme.fn.smallerThan('sm')]: {
      height: rem(42),
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    },

    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]
    })
  },

  hiddenMobile: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none'
    }
  },

  hiddenDesktop: {
    [theme.fn.largerThan('sm')]: {
      display: 'none'
    }
  }
}));

function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const { classes, theme } = useStyles();
  const { isLogged, user } = useAuthStore();

  return (
    <Box>
      <div className={classes.header}>
        <MantineHeader height={60} px="md">
          <Container sx={{ height: 60 }}>
            <Group align="center" position="apart" sx={{ height: '100%', width: '100%' }}>
              {isLogged ? (
                <div />
              ) : (
                <div>
                  <Logo />
                </div>
              )}

              <LanguagePicker />
              {!isLogged && (
                <Group sx={{ height: '100%' }} spacing={0} className={classes.hiddenMobile}>
                  {/* TODO: Link to app section */}
                  <Link to="/" className={classes.link}>
                    Home
                  </Link>
                  <Link to="/" className={classes.link}>
                    Learn
                  </Link>
                  <Link to="/" className={classes.link}>
                    Academy
                  </Link>
                </Group>
              )}

              <Group className={classes.hiddenMobile}>
                <ToggleColor />

                {user ? (
                  <Button component={Link} variant="default" to="profile" title="User profile">
                    {user.username}
                  </Button>
                ) : (
                  <>
                    <Button component={Link} to="/sign-in" variant="default">
                      Log in
                    </Button>
                    <Button component={Link} to="/sign-up" variant="default">
                      Sign up
                    </Button>
                  </>
                )}
              </Group>

              <Burger
                opened={drawerOpened}
                onClick={toggleDrawer}
                className={classes.hiddenDesktop}
              />
            </Group>
          </Container>
        </MantineHeader>

        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size="100%"
          padding="md"
          title="Navigation"
          className={classes.hiddenDesktop}
          zIndex={1000000}>
          <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
            <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />

            <a href="todo" className={classes.link}>
              Home
            </a>
            <a href="todo" className={classes.link}>
              Learn
            </a>
            <a href="todo" className={classes.link}>
              Academy
            </a>

            <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />

            <Group position="center" grow pb="xl" px="md">
              <ToggleColor />
              <Button variant="default">Log in</Button>
              <Button>Sign up</Button>
            </Group>
          </ScrollArea>
        </Drawer>
      </div>
    </Box>
  );
}

export default Header;
