import React, { useContext } from 'react';

import { Flex, LoadingOverlay, createStyles } from '@mantine/core';
import { Route, Routes } from 'react-router-dom';

import { Footer, Header, Navbar, NotFound, ProtectedRoute } from 'components';
import { AccountDetail, Accounts } from 'features/accounts';
import { AccountCreate } from 'features/accounts/CreateAccount/CreateAccount';
import { Profile, SignIn, UserContext } from 'features/authentication';
import { Dashboard } from 'features/dashboard';
import { Landing } from 'features/home';

const useStyles = createStyles(() => ({
  shell: {
    width: '100%',
    padding: 0,
    margin: 0,

    '& > *': {
      width: '100%'
    }
  },

  // header size 60
  content: { minHeight: 'calc(100vh - 60px)', marginTop: 60 }
}));

export function AppShell() {
  const { classes } = useStyles();
  const { isLogged, isAppReady } = useContext(UserContext);

  if (!isAppReady) {
    return <LoadingOverlay visible />;
  }

  return (
    <main className={classes.shell}>
      {isLogged ? (
        <Flex>
          <Navbar />
          <Flex direction="column" w="100%">
            <Header />
            <Flex direction="column" className={classes.content}>
              <div style={{ flex: 1 }}>
                <Routes>
                  <Route element={<ProtectedRoute isAllowed={isLogged} />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/accounts" element={<Accounts />} />
                    <Route path="/accounts/:id" element={<AccountDetail />} />
                    <Route path="/accounts/create" element={<AccountCreate />} />
                    <Route path="/profile" element={<Profile />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Footer />
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <div>
          <Header />
          <Flex direction="column" className={classes.content}>
            <div style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </Flex>
        </div>
      )}
    </main>
  );
}
