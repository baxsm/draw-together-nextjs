"use client";

import { useChatStore } from "@/stores/chatStore";
import { useMembersStore } from "@/stores/membersStore";
import { Ghost } from "lucide-react";
import { FC, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

interface ChatFeedProps {}

const ChatFeed: FC<ChatFeedProps> = ({}) => {
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
      className="h-80 max-h-80 overflow-y-auto customScrollbar"
    >
      {members.length === 1 ? (
        <div className="flex flex-col gap-4 items-center justify-center h-full">
          <Ghost className="w-5 h-5 animate-bounce" />
          <h5 className="text-base text-foreground font-semibold">
            You seem alone!
          </h5>
        </div>
      ) : (
        <div className="flex flex-col gap-4 p-4">
          {messages.map((message, index) => {
            return <ChatMessage message={message} key={index} />;
          })}
        </div>
      )}
    </div>
  );
};

export default ChatFeed;
