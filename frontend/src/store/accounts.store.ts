import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  AccountDetailsModel,
  AccountModel,
  CreateAccountDTO
} from 'features/accounts/accounts.model';
import { TransactionFilterModel, TransactionModel } from 'features/transactions';
import { api } from 'services/http';
import { useAuthStore } from 'store';

type AccountsStore = {
  pending: boolean;
  accounts: AccountModel[];
  reset: () => void;
  fetchAccounts: () => void;
  getAccounts: () => void;
  // TODO: should it be in store??? because it doesn't store anything
  getAccount: (id: string, includeTransaction: boolean) => Promise<AccountDetailsModel>;
  getAccountTransactions: (
    accountId: string,
    filters: TransactionFilterModel
  ) => Promise<TransactionModel[]>;
  addAccount: (account: CreateAccountDTO) => Promise<boolean>;
  updateAccount: (id: string, account: CreateAccountDTO) => Promise<boolean>;
  deleteAccount: (id: number) => Promise<boolean>;
};

const accountStore = 'Accounts store';

export const useAccountStore = create<AccountsStore>()(
  devtools(
    (set, get) => ({
      pending: false,
      accounts: [],
      reset: () => {
        set({ pending: false, accounts: [] });
      },
      getAccounts: () => {
        set({ ...get(), pending: true });
        const { accounts } = get();

        if (accounts.length === 0) {
          get().fetchAccounts();
        } else {
          set({ ...get(), pending: false });
        }
      },

      getAccount: async (
        id: string,
        includeTransactions: boolean = true
      ): Promise<AccountDetailsModel> => {
        const account = await api.get<AccountDetailsModel>({
          url: `accounts/${id}?include_transactions=${includeTransactions}`,
          token: useAuthStore.getState().token
        });
        console.log(account);
        return account;
      },

      getAccountTransactions: async (
        accountId: string,
        filters: TransactionFilterModel
      ): Promise<TransactionModel[]> => {
        let queryParams: URLSearchParams = new URLSearchParams();
        if (filters) {
          queryParams = new URLSearchParams({
            accounts: accountId,
            start_date: filters.dateRange[0]?.toISOString() ?? '',
            end_date: filters.dateRange[1]?.toISOString() ?? '',
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

        return transactions;
      },

      fetchAccounts: async () => {
        const accounts = await api.get<AccountModel[]>({
          url: 'accounts',
          token: useAuthStore.getState().token
        });
        set({ accounts, pending: false });
      },

      addAccount: async (account: CreateAccountDTO): Promise<boolean> => {
        const { accounts } = get();

        try {
          const response = await api.post<CreateAccountDTO, AccountModel>({
            url: 'accounts',
            body: account,
            token: useAuthStore.getState().token
          });
          console.log(response);
          set({ ...get(), accounts: [...accounts, response] });
          return true;
        } catch (reason) {
          console.log(reason);
          return false;
        }
      },

      updateAccount: async (id: string, account: CreateAccountDTO): Promise<boolean> => {
        const { accounts } = get();

        try {
          const response = await api.put<CreateAccountDTO, AccountModel>({
            url: `accounts/${id}`,
            body: account,
            token: useAuthStore.getState().token
          });

          const idx = accounts.findIndex((t) => String(t.id) === id);
          if (idx !== -1) {
            accounts[idx] = response;
            // TODO: are there transactions
          }

          set({ ...get(), accounts: [...accounts] });
          return true;
        } catch (reason) {
          console.log(reason);
          return false;
        }
      },
      deleteAccount: async (id: number): Promise<boolean> => {
        const { accounts } = get();

        try {
          const response = await api.delete<any>({
            url: `accounts/${id}`,
            token: useAuthStore.getState().token
          });

          if (response.ok) {
            const updatedAccounts = accounts.filter((t) => t.id !== id);

            set({ ...get(), accounts: [...updatedAccounts] });
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
      store: accountStore
    }
  )
);
