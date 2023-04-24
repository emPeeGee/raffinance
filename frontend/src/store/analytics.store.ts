import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { api } from 'services/http';
import { useAuthStore } from 'store';

export interface ReportModel<T> {
  title: string;
  data?: T;
}

export interface LabelValueModel {
  label: string;
  value: any;
}

export interface DateValueModel {
  date: string;
  value: any;
}

export interface CashFlowModel {
  date: string;
  cashFlow: number;
  income: number;
  expense: number;
}

function getLastDayOfMonth(date: Date | null | undefined): Date | null {
  if (date === null || date === undefined) {
    return null;
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const lastDayOfMonth = new Date(year, month, 0);
  return lastDayOfMonth;
}

type Range = [Date | null, Date | null];

function getDateRangeQueryParam(range: Range = [null, null]) {
  const startDate = range[0];
  const endDate = range[1];

  const e = getLastDayOfMonth(endDate ?? startDate)?.toISOString() ?? '';
  // if only one month is selected, put end_date be same as start_date

  const queryParams = new URLSearchParams({
    start_date: startDate?.toISOString() ?? '',
    end_date: e
  });

  return queryParams;
}

type AnalyticsStore = {
  pending: boolean;
  reset: () => void;
  date: Range;
  setDate: (range: [Date | null, Date | null]) => void;
  categoriesSpending: LabelValueModel[];
  getCategoriesSpending: (range?: Range) => void;
  categoriesIncome: LabelValueModel[];
  getCategoriesIncome: (range?: Range) => void;
  // TODO: Component itself should make the queries
  balanceEvo: DateValueModel[];
  getBalanceEvo: (range?: [Date | null, Date | null]) => void;
  cashFlow: CashFlowModel[];
  getCashFlow: (range?: [Date | null, Date | null]) => void;
};

const analyticsStore = 'Analytics store';

export const useAnalyticsStore = create<AnalyticsStore>()(
  devtools(
    (set, get) => ({
      pending: false,
      date: [null, null],
      setDate: (range) => {
        console.log(range);
        const newRange: Range = [range[0], getLastDayOfMonth(range[1])];
        set({ ...get(), date: newRange });

        get().getBalanceEvo(range);
        get().getCategoriesIncome(range);
        get().getCategoriesSpending(range);
        get().getCashFlow(range);
      },
      categoriesSpending: [],
      categoriesIncome: [],
      balanceEvo: [],
      cashFlow: [],
      reset: () => {
        set({ pending: false });
      },
      getCategoriesIncome: async (range?: Range) => {
        set({ ...get(), pending: true });
        const { categoriesIncome } = get();

        const queryParams = getDateRangeQueryParam(range);
        const report = await api.get<ReportModel<LabelValueModel[]>>({
          url: `analytics/categoriesIncome?${queryParams}`,
          token: useAuthStore.getState().token
        });
        set({ categoriesIncome: report.data ?? [], pending: false });
      },

      getCategoriesSpending: async (range?: Range) => {
        set({ ...get(), pending: true });
        const { categoriesSpending } = get();

        const queryParams = getDateRangeQueryParam(range);
        const report = await api.get<ReportModel<LabelValueModel[]>>({
          url: `analytics/categoriesSpending?${queryParams}`,
          token: useAuthStore.getState().token
        });
        set({ categoriesSpending: report?.data ?? [], pending: false });
      },

      getBalanceEvo: async (range?: Range) => {
        set({ ...get(), pending: true });

        const queryParams = getDateRangeQueryParam(range);
        const report = await api.get<ReportModel<DateValueModel[]>>({
          url: `analytics/balanceEvolution?${queryParams}`,
          token: useAuthStore.getState().token
        });
        set({ balanceEvo: report.data ?? [], pending: false });
      },

      getCashFlow: async (range?: [Date | null, Date | null]) => {
        set({ ...get(), pending: true });

        const queryParams = getDateRangeQueryParam(range);
        const report = await api.get<ReportModel<CashFlowModel[]>>({
          url: `analytics/cashFlow?${queryParams}`,
          token: useAuthStore.getState().token
        });
        set({ cashFlow: report?.data ?? [], pending: false });
      }
    }),
    {
      store: analyticsStore
    }
  )
);
