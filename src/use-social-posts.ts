import { create } from "zustand";

interface SocialPostsState {
  selected: string | null;
  setSocialPosts: (selected: string | null) => void;
}

export const useSocialPosts = create<SocialPostsState>((set) => ({
  selected: null,
  setSocialPosts: (selected) => set({ selected }),
}));
