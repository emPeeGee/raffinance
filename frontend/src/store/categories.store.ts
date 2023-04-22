import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { CreateCategoryDTO, CategoryModel } from 'features/categories';
import { api } from 'services/http';

import { useAuthStore } from './auth.store';

type CategoriesStore = {
  pending: boolean;
  categories: CategoryModel[];
  reset: () => void;
  fetchCategories: () => void;
  getCategories: () => void;
  // TODO: should it be in store??? because it doesn't store anything
  getCategory: (id: number) => CategoryModel | undefined;
  addCategory: (category: CreateCategoryDTO) => Promise<boolean>;
  updateCategory: (id: number, category: CreateCategoryDTO) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;
};

const categoriesStore = 'Categories store';

export const useCategoriesStore = create<CategoriesStore>()(
  devtools(
    (set, get) => ({
      pending: false,
      categories: [],
      reset: () => {
        set({ pending: false, categories: [] });
      },
      getCategories: () => {
        set({ ...get(), pending: true });
        const { categories } = get();

        if (categories.length === 0) {
          get().fetchCategories();
        } else {
          set({ ...get(), pending: false });
        }
      },
      getCategory: (id: number): CategoryModel | undefined => {
        const category = get().categories.find((c) => c.id === id);
        return category;
      },
      fetchCategories: async () => {
        const categories = await api.get<CategoryModel[]>({
          url: 'categories',
          token: useAuthStore.getState().token
        });
        set({ categories, pending: false });
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
      },

      updateCategory: async (id: number, category: CreateCategoryDTO): Promise<boolean> => {
        const { categories } = get();

        try {
          const response = await api.put<CreateCategoryDTO, CategoryModel>({
            url: `categories/${id}`,
            body: category,
            token: useAuthStore.getState().token
          });

          const idx = categories.findIndex((c) => c.id === id);
          if (idx !== -1) {
            categories[idx] = response;
          }

          set({ ...get(), categories: [...categories] });
          return true;
        } catch (reason) {
          console.log(reason);
          return false;
        }
      },

      deleteCategory: async (id: number): Promise<boolean> => {
        const { categories } = get();

        try {
          const response = await api.delete<any>({
            url: `categories/${id}`,
            token: useAuthStore.getState().token
          });

          if (response.ok) {
            const updatedCategories = categories.filter((c) => c.id !== id);

            set({ ...get(), categories: [...updatedCategories] });
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
      store: categoriesStore
    }
  )
);
// TODO: kinda, response enum with different statuses

// TODO  useAuthStore.getState().token. I don't like to call it every time.
