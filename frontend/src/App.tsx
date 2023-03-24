import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  MantineThemeOverride
} from '@mantine/core';
import { GlobalStyles } from 'assets/styles/globalStyles';
import { Notifications, showNotification } from '@mantine/notifications';
import { AppShell, Offline } from 'components';
import { UserProvider } from 'features/authentication';
import { useLocalStorage, useNetworkStatus } from 'hooks';
import { COLOR_SCHEME_STORAGE_KEY, Theme, DateUnit } from 'utils';

const customTheme = (colorScheme: 'light' | 'dark'): MantineThemeOverride => ({
  colorScheme,
  fontFamily: 'Open Sans, sans serif',
  components: {
    Button: {
      styles: (theme) => ({
        root: {
          '&:focus': {
            outline: `2px solid ${theme.colors.orange[5]} !important`
          }
        }
      })
    },
    ActionIcon: {
      styles: (theme) => ({
        root: {
          '&:focus': {
            outline: `2px solid ${theme.colors.orange[5]} !important`
          }
        }
      })
    }
  }
});

function App() {
  const { isOnline } = useNetworkStatus();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>(
    COLOR_SCHEME_STORAGE_KEY,
    Theme.Light
  );
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === Theme.Light ? Theme.Dark : Theme.Light));
  };

  useEffect(() => {
    showNotification({
      title: isOnline ? 'You are online' : 'Oops. No internet connection.',
      message: isOnline
        ? 'Connection restored.'
        : 'Make sure wifi or cellular data is turned on and then try again.',
      color: isOnline ? 'green' : 'red',
      autoClose: DateUnit.second * 5
    });
  }, [isOnline]);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={customTheme(colorScheme)}>
        <Notifications />
        <BrowserRouter>
          <GlobalStyles />

          {!isOnline ? (
            <Offline />
          ) : (
            <UserProvider>
              <AppShell />
            </UserProvider>
          )}
        </BrowserRouter>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
