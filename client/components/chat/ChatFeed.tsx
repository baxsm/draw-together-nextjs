"use client";

import { Ghost, MessageCircleOff } from "lucide-react";
import { type FC, useEffect, useRef } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useMembersStore } from "@/stores/membersStore";
import ChatMessage from "./ChatMessage";
import SystemMessage from "./SystemMessage";

const isSystem = (msg: ChatMessageType): msg is SystemMessageType =>
  "type" in msg && msg.type === "system";

const ChatFeed: FC = () => {
  const { messages } = useChatStore();
  const { members } = useMembersStore();

  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTo(0, feedRef.current.scrollHeight);
    }
  }, [messages]);

  return (
    <div
      ref={feedRef}
      className="customScrollbar h-64 max-h-64 overflow-y-auto"
    >
      {members.length === 1 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Ghost className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-medium text-foreground text-sm">
              You seem alone!
            </p>
            <p className="text-muted-foreground text-xs">
              Share the room ID to invite others
            </p>
          </div>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <MessageCircleOff className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-medium text-foreground text-sm">
              No messages yet
            </p>
            <p className="text-muted-foreground text-xs">
              Start the conversation!
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-0.5 p-3">
          {messages.map((message, index) => {
            if (isSystem(message)) {
              return <SystemMessage message={message} key={message.id} />;
            }

            const prev = index > 0 ? messages[index - 1] : null;
            const showSender =
              !prev || isSystem(prev) || prev.userId !== message.userId;

            return (
              <ChatMessage
                message={message}
                showSender={showSender}
                key={message.id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatFeed;
