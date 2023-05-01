import React, { useEffect, useState } from 'react';

import { Flex, LoadingOverlay, createStyles } from '@mantine/core';
import { Route, Routes } from 'react-router-dom';

import { Footer, Header, Navbar, NotFound, ProtectedRoute } from 'components';
import { Accounts } from 'features/accounts';
import { Profile, SignIn, SignUp } from 'features/authentication';
import { Categories } from 'features/categories';
import { Dashboard } from 'features/dashboard';
import { Landing } from 'features/home';
import { Tags } from 'features/tags';
import { Transactions } from 'features/transactions';
import {
  FetchUserStatus,
  useAccountStore,
  useAuthStore,
  useCategoriesStore,
  useTagsStore
} from 'store';

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
  const { isLogged, fetchUser } = useAuthStore();
  const { getCategories } = useCategoriesStore();
  const { getTags } = useTagsStore();
  const { getAccounts } = useAccountStore();
  const [isAppReady, setIsAppReady] = useState(false);

  // TODO: revise the authentication logic
  const getUser = async () => {
    const result = await fetchUser();
    if (FetchUserStatus.EXPIRED_TOKEN === result) {
      // TODO: Notification
    }
    // TODO: i would make a separate component as main entry point auth users

    if (FetchUserStatus.OK === result) {
      await getAccounts();
      await getTags();
      await getCategories();
    }

    setIsAppReady(true);
  };

  // TODO: too many renders on init
  useEffect(() => {
    getUser();
  }, []);

  console.info('App shell render');

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
                    <Route path="/accounts/*" element={<Accounts />} />
                    <Route path="/transactions/*" element={<Transactions />} />
                    <Route path="/categories/*" element={<Categories />} />
                    <Route path="/tags/*" element={<Tags />} />
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
                <Route path="/sign-up" element={<SignUp />} />
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
