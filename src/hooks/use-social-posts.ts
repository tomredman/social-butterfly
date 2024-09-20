import { create } from "zustand";

interface SocialPostsState {
  selected: null | string;
  setSocialPosts: (selected: null | string) => void;
}

export const useSocialPosts = create<SocialPostsState>((set) => ({
  selected: null,
  setSocialPosts: (selected) => set({ selected }),
}));
