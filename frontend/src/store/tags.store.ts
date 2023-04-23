import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { TagModel, CreateTagDTO } from 'features/tags';
import { api } from 'services/http';

import { useAuthStore } from './auth.store';

type TagsStore = {
  pending: boolean;
  tags: TagModel[];
  reset: () => void;
  fetchTags: () => void;
  getTags: () => void;
  getTag: (id: number) => TagModel | undefined;
  addTag: (tag: CreateTagDTO) => Promise<boolean>;
  updateTag: (id: number, tag: CreateTagDTO) => Promise<boolean>;
  deleteTag: (id: number) => Promise<boolean>;
};

const tagsStore = 'Tags store';

export const useTagsStore = create<TagsStore>()(
  devtools(
    (set, get) => ({
      pending: false,
      tags: [],
      reset: () => {
        set({ pending: false, tags: [] });
      },
      getTags: () => {
        set({ ...get(), pending: true });
        const { tags } = get();

        if (tags.length === 0) {
          get().fetchTags();
        } else {
          set({ ...get(), pending: false });
        }
      },
      getTag: (id: number): TagModel | undefined => {
        const tag = get().tags.find((c) => c.id === id);
        return tag;
      },
      fetchTags: async () => {
        const tags = await api.get<TagModel[]>({
          url: 'tags',
          token: useAuthStore.getState().token
        });
        set({ tags, pending: false });
      },
      addTag: async (tag: CreateTagDTO): Promise<boolean> => {
        const { tags } = get();

        try {
          const response = await api.post<CreateTagDTO, TagModel>({
            url: 'tags',
            body: tag,
            token: useAuthStore.getState().token
          });
          set({ ...get(), tags: [...tags, response] });
          return true;
        } catch (reason) {
          console.log(reason);
          return false;
        }
      },

      updateTag: async (id: number, tag: CreateTagDTO): Promise<boolean> => {
        const { tags } = get();

        try {
          const response = await api.put<CreateTagDTO, TagModel>({
            url: `tags/${id}`,
            body: tag,
            token: useAuthStore.getState().token
          });

          const idx = tags.findIndex((c) => c.id === id);
          if (idx !== -1) {
            tags[idx] = response;
          }

          set({ ...get(), tags: [...tags] });
          return true;
        } catch (reason) {
          console.log(reason);
          return false;
        }
      },

      deleteTag: async (id: number): Promise<boolean> => {
        const { tags } = get();

        try {
          const response = await api.delete<any>({
            url: `tags/${id}`,
            token: useAuthStore.getState().token
          });

          if (response.ok) {
            const updatedTags = tags.filter((c) => c.id !== id);

            set({ ...get(), tags: [...updatedTags] });
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
      store: tagsStore
    }
  )
);
