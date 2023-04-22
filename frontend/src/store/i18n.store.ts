import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { Language, languages } from 'utils';

type StoreState = {
  locale: Language;
  setLocale: (locale: Language) => void;
};

const i18nStoreName = 'I18STORE';

export const useI18nStore = create<StoreState>()(
  devtools(
    (set) => ({
      locale: languages[0],
      setLocale: (locale) => set(() => ({ locale }), false, 'setLocaale')
    }),
    {
      store: i18nStoreName
    }
  )
);
