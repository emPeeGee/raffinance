import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { TransactionModel, CreateTransactionDTO } from 'features/transactions';
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
  getTransaction: (id: string) => Promise<TransactionModel>;
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

      getTransaction: async (id: string): Promise<TransactionModel> => {
        const transaction = await api.get<TransactionModel>({
          url: `transactions/${id}`,
          token: useAuthStore.getState().token
        });
        return transaction;
      },

      fetchTransactions: async () => {
        set({ ...get(), pending: true });
        const transactions = await api.get<TransactionModel[]>({
          url: 'transactions',
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
