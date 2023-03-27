import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { CreateCategoryDTO, CategoryModel } from 'features/categories';
import { api } from 'services/http';

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
const tok =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Nzk5ODQwMjAsImlhdCI6MTY3OTk0MDgyMCwidXNlcklkIjoxfQ.ZucjfEot33GBc34TkA047LW0PqXFDOnwevWf3VzXlVw';

export const useCategoriesStore = create<CategoriesStore>()(
  devtools(
    (set, get) => ({
      // TODO: I need it??
      // viewMode: 'card',
      // setViewMode: (viewMode) => set({ viewMode }),
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
        const categories = await api.get<CategoryModel[]>({ url: 'categories', token: tok });
        console.log(categories);
        set({ categories });
      },
      addCategory: async (category: CreateCategoryDTO): Promise<boolean> => {
        const { categories } = get();

        try {
          const response = await api.post<CreateCategoryDTO, CategoryModel>({
            url: 'categories',
            body: category,
            token: tok
          });
          console.log(response);
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
