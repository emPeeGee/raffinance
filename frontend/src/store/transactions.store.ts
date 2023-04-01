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

// TODO: is loading in store?
type TransactionsStore = {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  transactions: TransactionModel[];
  fetchTransactions: () => void;
  getTransactions: () => void;
  // TODO: should it be in store??? because it doesn't store anything
  getTransaction: (id: string) => Promise<TransactionDetailsModel>;
  addTransaction: (transaction: CreateTransactionDTO) => Promise<boolean>;
  // removeTransaction: (id: string) => void;
};

const transactionStore = 'Transactions store';

export const useTransactionStore = create<TransactionsStore>()(
  devtools(
    (set, get) => ({
      viewMode: 'card',
      setViewMode: (viewMode) => set({ viewMode }),
      transactions: [],
      getTransactions: () => {
        console.log(get().transactions);
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
        const transactions = await api.get<TransactionModel[]>({
          url: 'transactions',
          token: useAuthStore.getState().token
        });
        console.log(transactions);
        set({ transactions });
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
