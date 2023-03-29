import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { CreateCategoryDTO, CategoryModel } from 'features/categories';
import { api } from 'services/http';

import { useAuthStore } from './auth.store';

type CategoriesStore = {
  categories: CategoryModel[];
  fetchCategories: () => void;
  getCategories: () => void;
  // TODO: should it be in store??? because it doesn't store anything
  // getAccount: (id: string) => Promise<AccountDetailsModel>;
  addCategory: (category: CreateCategoryDTO) => Promise<boolean>;
  // removeAccount: (id: string) => void;
};

const categoriesStore = 'Categories store';

export const useCategoriesStore = create<CategoriesStore>()(
  devtools(
    (set, get) => ({
      categories: [],
      getCategories: () => {
        console.log(get().categories);
        const { categories } = get();

        if (categories.length === 0) {
          get().fetchCategories();
        }
      },
      // getAccount: async (id: string): Promise<AccountDetailsModel> => {
      //   const account = await api.get<AccountDetailsModel>({ url: `accounts/${id}`, token: tok });
      //   console.log(account);
      //   return account;
      // },
      fetchCategories: async () => {
        const categories = await api.get<CategoryModel[]>({
          url: 'categories',
          token: useAuthStore.getState().token
        });
        console.log(categories);
        set({ categories });
      },
      addCategory: async (category: CreateCategoryDTO): Promise<boolean> => {
        const { categories } = get();

        try {
          const response = await api.post<CreateCategoryDTO, CategoryModel>({
            url: 'categories',
            body: category,
            token: useAuthStore.getState().token
          });
          set({ ...get(), categories: [...categories, response] });
          return true;
        } catch (reason) {
          console.log(reason);
          return false;
        }
      }
    }),
    {
      store: categoriesStore
    }
  )
);

// TODO  useAuthStore.getState().token. I don't like to call it every time.
