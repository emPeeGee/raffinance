import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  TransactionDetailsModel,
  TransactionModel,
  CreateTransactionDTO
} from 'features/transactions/transactions.model';
import { api } from 'services/http';
import { useAuthStore } from 'store';
import { ViewMode } from 'utils';

type TransactionsStore = {
  pending: boolean;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  transactions: TransactionModel[];
  fetchTransactions: () => void;
  getTransactions: () => void;
  getTransaction: (id: string) => Promise<TransactionDetailsModel>;
  addTransaction: (transaction: CreateTransactionDTO) => Promise<boolean>;
  // removeTransaction: (id: string) => void;
};

const transactionStore = 'Transactions store';

export const useTransactionStore = create<TransactionsStore>()(
  devtools(
    (set, get) => ({
      pending: false,
      viewMode: 'card',
      setViewMode: (viewMode) => set({ viewMode }),
      transactions: [],
      getTransactions: () => {
        const { transactions } = get();

        if (transactions.length === 0) {
          get().fetchTransactions();
        }
      },

      getTransaction: async (id: string): Promise<TransactionDetailsModel> => {
        const transaction = await api.get<TransactionDetailsModel>({
          url: `transactions/${id}`,
          token: useAuthStore.getState().token
        });
        console.log(transaction);
        return transaction;
      },

      fetchTransactions: async () => {
        set({ ...get(), pending: true });
        setTimeout(async () => {
          const transactions = await api.get<TransactionModel[]>({
            url: 'transactions',
            token: useAuthStore.getState().token
          });
          console.log(transactions);
          set({ transactions, pending: false });
        }, 5000);
      },

      addTransaction: async (transaction: CreateTransactionDTO): Promise<boolean> => {
        const { transactions } = get();

        try {
          const response = await api.post<CreateTransactionDTO, TransactionModel>({
            url: 'transactions',
            body: transaction,
            token: useAuthStore.getState().token
          });
          console.log(response);
          set({ ...get(), transactions: [...transactions, response] });
          return true;
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
