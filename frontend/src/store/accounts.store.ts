import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  AccountDetailsModel,
  AccountModel,
  CreateAccountDTO,
  ViewMode
} from 'features/accounts/accounts.model';
import { api } from 'services/http';
import { useAuthStore } from 'store';

// TODO: is loading in store?
type AccountsStore = {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  accounts: AccountModel[];
  fetchAccounts: () => void;
  getAccounts: () => void;
  // TODO: should it be in store??? because it doesn't store anything
  getAccount: (id: string) => Promise<AccountDetailsModel>;
  addAccount: (account: CreateAccountDTO) => Promise<boolean>;
  // removeAccount: (id: string) => void;
};

const accountStore = 'Accounts store';

export const useAccountStore = create<AccountsStore>()(
  devtools(
    (set, get) => ({
      viewMode: 'card',
      setViewMode: (viewMode) => set({ viewMode }),
      accounts: [],
      getAccounts: () => {
        console.log(get().accounts);
        const { accounts } = get();

        if (accounts.length === 0) {
          get().fetchAccounts();
        }
      },

      getAccount: async (id: string): Promise<AccountDetailsModel> => {
        const account = await api.get<AccountDetailsModel>({
          url: `accounts/${id}`,
          token: useAuthStore.getState().token
        });
        console.log(account);
        return account;
      },

      fetchAccounts: async () => {
        const accounts = await api.get<AccountModel[]>({
          url: 'accounts',
          token: useAuthStore.getState().token
        });
        console.log(accounts);
        set({ accounts });
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
      }
    }),
    {
      store: accountStore
    }
  )
);
