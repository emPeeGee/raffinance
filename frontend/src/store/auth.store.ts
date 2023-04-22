import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { UserModel } from 'features/authentication';
import { api } from 'services/http';
import { useAccountStore, useCategoriesStore, useTagsStore, useTransactionStore } from 'store';
import { TOKEN_STORAGE_KEY } from 'utils';

// TODO: it was hook, how it is what?
// TODO: Move
function getToken<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') {
    return initialValue;
  }

  try {
    const item = window.localStorage.getItem(key);

    console.log('get loc tok', item);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.log(error);

    console.log('get loc tok', initialValue);
    return initialValue;
  }
}

function setStorageToken<T>(value: T | null) {
  try {
    if (typeof window !== 'undefined') {
      if (value === null || value === undefined) {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      } else {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(value));
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// TODO: More generic and move
export enum FetchUserStatus {
  OK,
  ERROR,
  EXPIRED_TOKEN,
  NO_TOKEN
}

type AuthStore = {
  token: string;
  setToken: (token: string) => void;
  isLogged: boolean;
  setIsLogged: (is: boolean) => void;
  fetchUser: () => Promise<FetchUserStatus>;
  user: UserModel | null;
  setUser: (user: UserModel) => void;
  logout: () => void;
  isAppReady: boolean;
};

const AUTH_STORE_NAME = 'Auth Store';

export const useAuthStore = create<AuthStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      isAppReady: false,
      isLogged: false,
      user: null,
      fetchUser: async (): Promise<FetchUserStatus> => {
        const { token, logout } = get();
        console.log('fetch user', token);

        if (!token || token.length === 0) {
          return FetchUserStatus.NO_TOKEN;
        }

        try {
          const response = await api.get<UserModel>({
            url: `user`,
            token: get().token
          });

          set({ ...get(), user: response, isLogged: true });
          return FetchUserStatus.OK;
        } catch (e) {
          console.log('err', e);
          logout();
          return FetchUserStatus.EXPIRED_TOKEN;
        }
      },
      setUser: (user: UserModel) => {
        set({ ...get(), user }, false, 'Set user');
      },
      token: getToken(TOKEN_STORAGE_KEY, ''),
      setIsLogged: (isLogged: boolean) => {
        set({ ...get(), isLogged }, false, 'setIsLogged');
      },
      setToken: (token: string) => {
        setStorageToken(token);
        set({ ...get(), token }, false, 'setToken');
      },
      logout: () => {
        setStorageToken(null);
        useAccountStore.getState().reset();
        useCategoriesStore.getState().reset();
        useTagsStore.getState().reset();
        useTransactionStore.getState().reset();

        set({ ...get(), isLogged: false, user: null, token: '' });
      }
    })),
    {
      store: AUTH_STORE_NAME
    }
  )
);

const unsub = useAuthStore.subscribe(
  (state) => state.token,
  (token, prev) => {
    // set();
    // if (!token || token.length === 0) {
    //   setIsAppReady(true);
    //   return;
    // }

    // api
    //   .get<UserModel>({
    //     url: `user`,
    //     token
    //   })
    //   .then((response) => {
    //     setUser(response);
    //     setIsLogged(true);
    //     navigate(`/profile`);
    //   })
    //   .catch(() => logout())
    //   .finally(() => {
    //     setIsAppReady(true);
    //   });
    console.log('Subscribe', token, prev);
  }
);

// TODO: instruction in case first time login, like you should have account and categs
// to make transactions
