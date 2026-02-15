"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useParams } from "next/navigation";
import { type FC, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { socket } from "@/lib/socket";
import { useChatStore } from "@/stores/chatStore";
import { useMembersStore } from "@/stores/membersStore";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import MessageFeed from "./ChatFeed";
import Members from "./Members";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";

const TYPING_STALE_MS = 3000;

const ChatBox: FC = () => {
  const { roomId } = useParams();
  const {
    messages,
    setMessages,
    addMessage,
    unreadCount,
    incrementUnread,
    resetUnread,
    setTyping,
    clearTyping,
  } = useChatStore();
  const { setMembers } = useMembersStore();
  const [isOpen, setIsOpen] = useState(false);
  const typingTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  useEffect(() => {
    socket.on("get-chat-state", () => {
      socket.emit("send-chat-state", { messages, roomId });
    });

    socket.on("chat-state-from-server", (messages: ChatMessageType[]) => {
      setMessages(messages);
    });

    socket.on("chat-message-from-server", (message: MessageType) => {
      addMessage(message);
      clearTyping(message.userId);
      if (!isOpen) incrementUnread();
    });

    socket.on("system-message-from-server", (message: SystemMessageType) => {
      addMessage(message);
      if (!isOpen) incrementUnread();
    });

    socket.on("update-members", (members: UserType[]) => {
      setMembers(members);
      const memberIds = new Set(members.map((m) => m.id));
      for (const [userId] of useChatStore.getState().typingUsers) {
        if (!memberIds.has(userId)) {
          clearTyping(userId);
        }
      }
    });

    socket.on("send-notification", ({ message }: NotificationType) => {
      toast(message);
    });

    socket.on(
      "user-typing",
      ({
        userId,
        username,
        isTyping,
      }: { userId: string; username: string; isTyping: boolean }) => {
        if (isTyping) {
          setTyping(userId, username);
          const existing = typingTimers.current.get(userId);
          if (existing) clearTimeout(existing);
          typingTimers.current.set(
            userId,
            setTimeout(() => {
              clearTyping(userId);
              typingTimers.current.delete(userId);
            }, TYPING_STALE_MS),
          );
        } else {
          clearTyping(userId);
          const existing = typingTimers.current.get(userId);
          if (existing) {
            clearTimeout(existing);
            typingTimers.current.delete(userId);
          }
        }
      },
    );

    return () => {
      socket.off("get-chat-state");
      socket.off("chat-state-from-server");
      socket.off("chat-message-from-server");
      socket.off("system-message-from-server");
      socket.off("update-members");
      socket.off("send-notification");
      socket.off("user-typing");
    };
  }, [
    setMessages,
    addMessage,
    setMembers,
    roomId,
    messages,
    isOpen,
    incrementUnread,
    setTyping,
    clearTyping,
  ]);

  const handleOpen = () => {
    setIsOpen(true);
    resetUnread();
  };

  return (
    <div className="absolute right-4 bottom-4 z-20">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="chat-toggle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              onClick={handleOpen}
              size="icon"
              className="relative h-10 w-10 cursor-pointer rounded-full shadow-lg"
              aria-label="Open chat"
            >
              <MessageCircle className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 font-bold text-[10px] text-destructive-foreground">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-80 overflow-hidden rounded-xl border border-border/60 bg-background/80 shadow-lg backdrop-blur-xl"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Messages</h3>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="h-6 w-6 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Separator />
            <Members />
            <MessageFeed />
            <TypingIndicator />
            <MessageInput />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBox;
