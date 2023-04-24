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

export interface DateValueModel {
  date: string;
  value: any;
}

type AnalyticsStore = {
  pending: boolean;
  reset: () => void;
  categoriesSpending: LabelValueModel[];
  categoriesIncome: LabelValueModel[];
  getCategoriesSpending: () => Promise<LabelValueModel[]>;
  getCategoriesIncome: () => Promise<LabelValueModel[]>;
  // TODO: Component itself should make the queries
  balanceEvo: DateValueModel[];
  getBalanceEvo: () => void;
  cashFlow: DateValueModel[];
  getCashFlow: () => void;
};

const analyticsStore = 'Analytics store';

export const useAnalyticsStore = create<AnalyticsStore>()(
  devtools(
    (set, get) => ({
      pending: false,
      categoriesSpending: [],
      categoriesIncome: [],
      balanceEvo: [],
      cashFlow: [],
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
      },

      getBalanceEvo: async () => {
        set({ ...get(), pending: true });
        const { balanceEvo } = get();

        if (balanceEvo.length === 0) {
          const report = await api.get<ReportModel<DateValueModel[]>>({
            url: 'analytics/balanceEvolution',
            token: useAuthStore.getState().token
          });
          set({ balanceEvo: report.data, pending: false });
          return;
        }

        set({ ...get(), pending: false });
      },

      getCashFlow: async () => {
        set({ ...get(), pending: true });
        const { cashFlow } = get();

        if (cashFlow.length === 0) {
          const report = await api.get<ReportModel<DateValueModel[]>>({
            url: 'analytics/cashFlow',
            token: useAuthStore.getState().token
          });
          set({ cashFlow: report.data, pending: false });
          return;
        }

        set({ ...get(), pending: false });
      }
    }),
    {
      store: analyticsStore
    }
  )
);
