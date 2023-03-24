import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { UserModel } from 'features/authentication/authentication.model';
import { useLocalStorage } from 'hooks';
import { TOKEN_STORAGE_KEY } from 'utils';
import { api } from 'services/http';
import { Navigate, useNavigate } from 'react-router-dom';
import { LoadingOverlay } from '@mantine/core';

export interface UserContextModel {
  isAppReady: boolean;
  isLogged: boolean;
  user?: UserModel;
  token?: string;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
}

const initialValue: UserContextModel = {
  isAppReady: false,
  isLogged: false,
  user: undefined,
  token: undefined,
  setToken: () => {},
  logout: () => {}
};

export const UserContext = React.createContext<UserContextModel>(initialValue);

type UserProviderProps = {
  children: ReactNode;
};

export function UserProvider({ children }: UserProviderProps): React.ReactElement {
  // It means that user authentications logic is done, loading is done
  const [isAppReady, setIsAppReady] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_KEY, '');
  const [user, setUser] = useState<UserModel>();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setUser(undefined);
    setToken(undefined);
    setIsLogged(false);
    // setIsAppReady(true);
    console.log('logout');
  }, [setToken, setUser]);

  const value = useMemo(
    () => ({ isAppReady, isLogged, user, token, setToken, logout }),
    [isAppReady, isLogged, user, token, setToken, logout]
  );

  useEffect(() => {
    setIsAppReady(false);
    console.log(token);
    if (!token || token.length === 0) {
      setIsAppReady(true);
      return;
    }

    api
      .get<UserModel>({
        url: `user`,
        token
      })
      .then((response) => {
        setUser(response);
        setIsLogged(true);
        // TODO: Dashboard page
        navigate(`/profile`, {
          replace: true
        });
      })
      .catch(() => logout())
      .finally(() => {
        setIsAppReady(true);
      });
  }, [token]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
