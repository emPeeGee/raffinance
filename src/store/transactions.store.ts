/* eslint-disable @typescript-eslint/naming-convention */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  TransactionModel,
  CreateTransactionDTO,
  TransactionFilterModel
} from 'features/transactions';
import { api } from 'services/http';
import { useAuthStore } from 'store';

type TransactionsStore = {
  pending: boolean;
  transactions: TransactionModel[];
  reset: () => void;
  fetchTransactions: (filters?: TransactionFilterModel) => void;
  getTransactions: () => void;
  getTransaction: (id: string) => Promise<TransactionModel | null>;
  addTransaction: (transaction: CreateTransactionDTO) => Promise<boolean>;
  updateTransaction: (id: string, transaction: CreateTransactionDTO) => Promise<boolean>;
  deleteTransaction: (id: number) => Promise<boolean>;
};

const transactionStore = 'Transactions store';

export const useTransactionStore = create<TransactionsStore>()(
  devtools(
    (set, get) => ({
      pending: false,
      transactions: [],
      reset: () => {
        set({ pending: false, transactions: [] });
      },
      getTransactions: () => {
        const { transactions } = get();

        if (transactions.length === 0) {
          get().fetchTransactions();
        }
      },

      getTransaction: async (id: string): Promise<TransactionModel | null> => {
        try {
          const transaction = await api.get<TransactionModel>({
            url: `transactions/${id}`,
            token: useAuthStore.getState().token
          });
          return transaction;
        } catch (error) {
          console.log(error);
          return null;
        }
      },

      fetchTransactions: async (filters?: TransactionFilterModel) => {
        set({ ...get(), pending: true });
        let queryParams: URLSearchParams = new URLSearchParams();
        if (filters) {
          const startDate = filters.dateRange[0]?.toISOString();
          const endDate = filters.dateRange[1]?.toISOString();
          queryParams = new URLSearchParams({
            start_date: startDate ?? '',
            end_date: endDate ?? startDate ?? '', // if only one month is selected, put end_date be same as start_date
            accounts: filters.accounts.join(','),
            categories: filters.categories.join(','),
            tags: filters.tags.join(','),
            type: filters.type,
            description: filters.description
          });
        }

        const transactions = await api.get<TransactionModel[]>({
          url: filters ? `transactions/f?${queryParams}` : 'transactions',
          token: useAuthStore.getState().token
        });

        set({ transactions, pending: false });
      },

      addTransaction: async (transaction: CreateTransactionDTO): Promise<boolean> => {
        const { transactions } = get();

        try {
          const response = await api.post<CreateTransactionDTO, TransactionModel>({
            url: 'transactions',
            body: transaction,
            token: useAuthStore.getState().token
          });
          set({ ...get(), transactions: [...transactions, response] });
          return true;
        } catch (reason) {
          console.log(reason);
          return false;
        }
      },
      updateTransaction: async (
        id: string,
        transaction: CreateTransactionDTO
      ): Promise<boolean> => {
        const { transactions } = get();

        try {
          const response = await api.put<CreateTransactionDTO, TransactionModel>({
            url: `transactions/${id}`,
            body: transaction,
            token: useAuthStore.getState().token
          });

          const idx = transactions.findIndex((t) => String(t.id) === id);
          if (idx !== -1) {
            transactions[idx] = response;
          }

          set({ ...get(), transactions: [...transactions] });
          return true;
        } catch (reason) {
          console.log(reason);
          return false;
        }
      },

      deleteTransaction: async (id: number): Promise<boolean> => {
        const { transactions } = get();

        try {
          const response = await api.delete<any>({
            url: `transactions/${id}`,
            token: useAuthStore.getState().token
          });

          if (response.ok) {
            const updatedTransactions = transactions.filter((t) => t.id !== id);

            set({ ...get(), transactions: [...updatedTransactions] });
            return true;
          }

          return false;
        } catch (reason) {
          console.log(reason);
          return false;
        }
      }
    }),

    {
      store: transactionStore
    }
  )
);
