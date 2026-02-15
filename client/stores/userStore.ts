import { create } from "zustand";

interface UserState {
  user: UserType | null;
  role: UserRole;
  setUser: (user: UserType | null) => void;
  setRole: (role: UserRole) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  role: "member",
  setUser: (user) => set({ user, role: user?.role ?? "member" }),
  setRole: (role) => set({ role }),
}));
