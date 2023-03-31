import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { TagModel, CreateTagDTO } from 'features/tags';
import { api } from 'services/http';

import { useAuthStore } from './auth.store';

type TagsStore = {
  pending: boolean;
  tags: TagModel[];
  fetchTags: () => void;
  getTags: () => void;
  // TODO: should it be in store??? because it doesn't store anything
  getTag: (id: number) => TagModel | undefined;
  addTag: (tag: CreateTagDTO) => Promise<boolean>;
  updateTag: (id: number, tag: CreateTagDTO) => Promise<boolean>;
  // removeAccount: (id: string) => void;
};

const tagsStore = 'Tags store';

export const useTagsStore = create<TagsStore>()(
  devtools(
    (set, get) => ({
      pending: false,
      tags: [],
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
      }
    }),
    {
      store: tagsStore
    }
  )
);

// TODO  useAuthStore.getState().token. I don't like to call it every time.
