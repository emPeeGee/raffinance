import React, { ReactNode, useContext } from 'react';
import { LoadingOverlay, createStyles } from '@mantine/core';
import { Footer, Header, Navbar, NotFound, Offline, ProtectedRoute } from 'components';
import { Route, Routes } from 'react-router-dom';
import { Home } from 'features/home';
import { Profile, SignIn, UserContext } from 'features/authentication';

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
      <Header />
      <Navbar />
      {/* Footer size 270 and header size 60                  */}
      <div style={{ minHeight: 'calc(100vh - 270px - 60px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route element={<ProtectedRoute isAllowed={isLogged} />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </main>
  );
}
