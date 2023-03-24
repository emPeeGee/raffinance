import React, { useContext } from 'react';
import { Flex, LoadingOverlay, createStyles } from '@mantine/core';
import { Footer, Header, Navbar, NotFound, ProtectedRoute } from 'components';
import { Route, Routes } from 'react-router-dom';
import { Home } from 'features/home';
import { Profile, SignIn, UserContext } from 'features/authentication';
import { Dashboard } from 'features/dashboard';

const useStyles = createStyles(() => ({
  shell: {
    width: '100%',
    padding: 0,
    margin: 0,

    '& > *': {
      width: '100%'
    }
  },
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
            <div style={{ marginTop: 60 }}>
              <Routes>
                <Route element={<ProtectedRoute isAllowed={isLogged} />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Flex>
        </Flex>
      ) : (
        <div>
          {/* header size 60                  */}
          <Header />
          <Flex direction="column" className={classes.content}>
            <div style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
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
