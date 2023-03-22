import React, { useContext, useEffect, useState } from 'react';
import {
  useMantineColorScheme,
  createStyles,
  Header as MantineHeader,
  Group,
  ActionIcon,
  Button,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
  Container
} from '@mantine/core';
import { Link } from 'react-router-dom';

import { useDisclosure } from '@mantine/hooks';
import { UserContext } from 'features/authentication/';
// import rafflesia2 from 'assets/rafflesia2.svg';
// import { ReactComponent as Logo } from 'assets/rafflesia4.svg';
import { ReactComponent as Logo } from 'assets/rafflesia2.svg';
// import { Anchor } from 'components';
// import logo from 'assets/logo.svg';
// import {
//   IconGroup,
//   Icon,
//   Items,
//   ItemsRight,
//   ListItem,
//   UnorderedList,
//   Wrapper
// } from './Header.styles';

import { IconMoonStars, IconSun } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
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

export function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const { classes, theme } = useStyles();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [isDark, setIsDark] = useState(false);
  const userContext = useContext(UserContext);

  useEffect(() => {
    console.log(colorScheme);

    setIsDark(colorScheme === 'dark');
  }, [colorScheme]);

  const logout = () => {
    console.log('Logout');
    userContext?.setUser(null);
    userContext?.setToken(null);
  };

  console.log(logout, isDark, toggleColorScheme);

  return (
    <Box pb={16}>
      <MantineHeader height={60} px="md">
        <Container sx={{ height: 60 }}>
          <Group align="center" position="apart" sx={{ height: '100%' }}>
            <Link to="/">
              <div style={{ width: '40px', height: '40px' }}>
                <Logo fill={theme.colors.blue[6]} width="100%" height="100%" stroke="green" />
              </div>
            </Link>

            <Group sx={{ height: '100%' }} spacing={0} className={classes.hiddenMobile}>
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

            <Group className={classes.hiddenMobile}>
              <ActionIcon
                variant="outline"
                color={isDark ? 'yellow' : 'blue'}
                onClick={() => {
                  console.log('click');
                  toggleColorScheme();
                }}
                title="Toggle color scheme">
                {isDark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
              </ActionIcon>
              <Link to="/sign-in">
                <Button variant="default">Log in</Button>
              </Link>
              <Link to="/sign-up">
                <Button>Sign up</Button>
              </Link>
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
            <Button onClick={() => console.log('q23')}>fdsfds</Button>
            <ActionIcon
              variant="outline"
              color={isDark ? 'yellow' : 'blue'}
              onClick={() => {
                console.log('click');
                toggleColorScheme();
              }}
              title="Toggle color scheme">
              fdsfds
              {isDark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
            </ActionIcon>
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );

  // return (
  //   <Wrapper>
  //     <Items>
  //       <IconGroup to="/" tabIndex={0}>
  //         <Icon src={logo} alt="Application logo" />
  //         <Text weight={700} color={isDark ? 'white' : 'black'}>
  //           Toss That Thought
  //         </Text>
  //       </IconGroup>
  //       <ItemsRight>
  //         <UnorderedList>
  //           <ListItem>
  //             <ActionIcon
  //               variant="outline"
  //               color={isDark ? 'yellow' : 'blue'}
  //               onClick={() => toggleColorScheme()}
  //               title="Toggle color scheme">
  //               {isDark ? <Sun size={18} /> : <MoonStars size={18} />}
  //             </ActionIcon>
  //           </ListItem>

  //           {userContext?.user ? (
  //             <>
  //               <ListItem>
  //                 <Anchor to="profile" title={userContext?.user?.username ?? 'Profile'} />
  //               </ListItem>
  //               <ListItem>
  //                 <Anchor to="profile/recent" title="Recent thoughts" />
  //               </ListItem>
  //               <ListItem onClick={() => logout()}>
  //                 <Anchor to="/" title="Log out" />
  //               </ListItem>
  //             </>
  //           ) : (
  //             <>
  //               <ListItem>
  //                 <Anchor to="sign-in" title="Sign In" />
  //               </ListItem>

  //               <ListItem>
  //                 <Anchor to="sign-up" title="Sign Up" />
  //               </ListItem>
  //             </>
  //           )}
  //         </UnorderedList>
  //       </ItemsRight>
  //     </Items>
  //   </Wrapper>
  // );
}
