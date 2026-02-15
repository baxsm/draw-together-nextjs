import { create } from "zustand";

interface CursorsState {
  cursors: Map<string, CursorData>;
  setCursor: (userId: string, data: CursorData) => void;
  removeCursor: (userId: string) => void;
  clearCursors: () => void;
}

export const useCursorsStore = create<CursorsState>((set) => ({
  cursors: new Map(),
  setCursor: (userId, data) =>
    set((state) => {
      const next = new Map(state.cursors);
      next.set(userId, data);
      return { cursors: next };
    }),
  removeCursor: (userId) =>
    set((state) => {
      const next = new Map(state.cursors);
      next.delete(userId);
      return { cursors: next };
    }),
  clearCursors: () => set({ cursors: new Map() }),
}));
