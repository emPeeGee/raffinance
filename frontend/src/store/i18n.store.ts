import * as dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import 'dayjs/locale/ro';
import 'dayjs/locale/ru';

import { Language, languages } from 'utils';

dayjs.extend(localeData);

type StoreState = {
  locale: Language;
  setLocale: (locale: Language) => void;
};

const i18nStoreName = 'I18STORE';

export const useI18nStore = create<StoreState>()(
  devtools(
    (set) => ({
      locale: languages[0],
      setLocale: (locale) => {
        dayjs.locale(locale.value);
        set(() => ({ locale }), false, 'setLocale');
      }
    }),
    {
      store: i18nStoreName
    }
  )
);
