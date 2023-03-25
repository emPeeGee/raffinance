import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { api } from 'services/http';
import { AccountModel, CreateAccountDTO, ViewMode } from './accounts.model';

type AccountsStore = {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  accounts: AccountModel[];
  fetchAccounts: () => void;
  getAccounts: () => void;
  addAccount: (account: CreateAccountDTO) => Promise<boolean>;
  // removeAccount: (id: string) => void;
};

const accountStore = 'Accounts store';
const tok =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Nzk3ODUxODYsImlhdCI6MTY3OTc0MTk4NiwidXNlcklkIjoxfQ.v6JxlWbb8GkoxzDY8bK0YKGZUcyUbWIQdXmp6OyIAhw';

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
      fetchAccounts: async () => {
        const accounts = await api.get<AccountModel[]>({ url: 'accounts', token: tok });
        console.log(accounts);
        set({ accounts });
      },

      addAccount: async (account: CreateAccountDTO): Promise<boolean> => {
        const { accounts } = get();

        try {
          const response = await api.post<CreateAccountDTO, AccountModel>({
            url: 'accounts',
            body: account,
            token: tok
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
