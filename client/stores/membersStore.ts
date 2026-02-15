import { create } from "zustand";

interface MembersState {
  members: UserType[];
  presenceMap: Map<string, PresenceStatus>;
  setMembers: (members: UserType[]) => void;
  setPresence: (userId: string, status: PresenceStatus) => void;
  clearPresence: () => void;
}

export const useMembersStore = create<MembersState>((set) => ({
  members: [],
  presenceMap: new Map(),
  setMembers: (members) => set({ members }),
  setPresence: (userId, status) =>
    set((state) => {
      const next = new Map(state.presenceMap);
      next.set(userId, status);
      return { presenceMap: next };
    }),
  clearPresence: () => set({ presenceMap: new Map() }),
}));
