import React, { useEffect } from 'react';

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  MantineThemeOverride
} from '@mantine/core';
import { Notifications, showNotification } from '@mantine/notifications';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';

import { AppShell, Offline } from 'components';
import { useLocalStorage, useNetworkStatus } from 'hooks';
import messages from 'i18n';
import { useI18nStore } from 'store';
import { COLOR_SCHEME_STORAGE_KEY, Theme, DateUnit } from 'utils';

// '*': {
//   box-sizing: border-box,
// },

// 'body': {
//   margin: 0,
//   padding: 0,
//   fontFamily: 'Open Sans sans-serif',
// }

const customTheme = (colorScheme: 'light' | 'dark'): MantineThemeOverride => ({
  colorScheme,
  fontFamily: 'Open Sans, sans serif',
  // TODO: User can choose accent color in settings
  // colors: {
  //   brand: [
  //     '#F0BBDD',
  //     '#ED9BCF',
  //     '#EC7CC3',
  //     '#ED5DB8',
  //     '#F13EAF',
  //     '#F71FA7',
  //     '#FF00A1',
  //     '#E00890',
  //     '#C50E82',
  //     '#AD1374'
  //   ]
  // },
  // primaryColor: 'brand',

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

  const { locale } = useI18nStore();

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
          {/* // TODO: Per feature locale string? */}
          <IntlProvider messages={messages[locale.value]} locale={locale.value}>
            {!isOnline ? <Offline /> : <AppShell />}
          </IntlProvider>
        </BrowserRouter>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
