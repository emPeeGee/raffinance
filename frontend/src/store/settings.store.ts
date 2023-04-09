/* eslint-disable @typescript-eslint/naming-convention */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { ViewMode } from 'utils';

type SettingsStore = {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
};

const transactionStore = 'Settings store';

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    (set, get) => ({
      viewMode: 'card',
      setViewMode: (viewMode) => set({ viewMode })
    }),

    {
      store: transactionStore
    }
  )
);
