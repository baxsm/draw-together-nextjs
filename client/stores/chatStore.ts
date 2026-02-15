import { create } from "zustand";

interface ChatState {
  messages: ChatMessageType[];
  unreadCount: number;
  typingUsers: Map<string, string>;
  addMessage: (message: ChatMessageType) => void;
  setMessages: (messages: ChatMessageType[]) => void;
  incrementUnread: () => void;
  resetUnread: () => void;
  setTyping: (userId: string, username: string) => void;
  clearTyping: (userId: string) => void;
  clearAllTyping: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  unreadCount: 0,
  typingUsers: new Map(),
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
  setMessages: (messages) => set({ messages }),
  incrementUnread: () => {
    set((state) => ({ unreadCount: state.unreadCount + 1 }));
  },
  resetUnread: () => set({ unreadCount: 0 }),
  setTyping: (userId, username) =>
    set((state) => {
      const next = new Map(state.typingUsers);
      next.set(userId, username);
      return { typingUsers: next };
    }),
  clearTyping: (userId) =>
    set((state) => {
      const next = new Map(state.typingUsers);
      next.delete(userId);
      return { typingUsers: next };
    }),
  clearAllTyping: () => set({ typingUsers: new Map() }),
}));
