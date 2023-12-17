import { create } from "zustand";

interface UserState {
  user: UserType | null;
  setUser: (user: UserType) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
