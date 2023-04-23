import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { api } from 'services/http';
import { useAuthStore } from 'store';

export interface ReportModel<T> {
  title: string;
  data: T;
}

export interface LabelValueModel {
  label: string;
  value: any;
}

type AnalyticsStore = {
  pending: boolean;
  reset: () => void;
  categoriesSpending: LabelValueModel[];
  categoriesIncome: LabelValueModel[];
  getCategoriesSpending: () => Promise<LabelValueModel[]>;
  getCategoriesIncome: () => Promise<LabelValueModel[]>;
};

const analyticsStore = 'Analytics store';

export const useAnalyticsStore = create<AnalyticsStore>()(
  devtools(
    (set, get) => ({
      pending: false,
      categoriesSpending: [],
      categoriesIncome: [],
      reset: () => {
        set({ pending: false });
      },
      getCategoriesIncome: async () => {
        set({ ...get(), pending: true });
        const { categoriesIncome } = get();

        if (categoriesIncome.length === 0) {
          const report = await api.get<ReportModel<LabelValueModel[]>>({
            url: 'analytics/categoriesIncome',
            token: useAuthStore.getState().token
          });
          set({ categoriesIncome: report.data, pending: false });
          return report.data;
        }

        set({ ...get(), pending: false });
        return categoriesIncome;
      },

      getCategoriesSpending: async () => {
        set({ ...get(), pending: true });
        const { categoriesSpending } = get();

        if (categoriesSpending.length === 0) {
          const report = await api.get<ReportModel<LabelValueModel[]>>({
            url: 'analytics/categoriesSpending',
            token: useAuthStore.getState().token
          });
          set({ categoriesSpending: report.data, pending: false });
          return report.data;
        }

        set({ ...get(), pending: false });
        return categoriesSpending;
      }
    }),
    {
      store: analyticsStore
    }
  )
);
