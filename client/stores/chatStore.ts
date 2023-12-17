import { create } from "zustand";

interface ChatState {
  messages: MessageType[];
  addMessage: (message: MessageType) => void;
  setMessages: (messages: MessageType[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) => {
    set((state) => ({
      ...state,
      messages: [...state.messages, message],
    }));
  },
  setMessages: (messages) => set({ messages }),
}));
