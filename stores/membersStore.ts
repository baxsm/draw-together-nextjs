import { create } from "zustand";
import { UserType } from "@/stores/userStore";

interface UserState {
  members: UserType[];
  setMembers: (members: UserType[]) => void;
}

export const useMembersStore = create<UserState>((set) => ({
  members: [],
  setMembers: (members) => set({ members }),
}));
