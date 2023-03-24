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
    minHeight: '100vh',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',

    '& > *': {
      width: '100%'
    }
  }
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
        <div style={{ minHeight: 'calc(100vh - 270px - 60px)' }}>
          {/* Footer size 270 and header size 60                  */}
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      )}
    </main>
  );
}
