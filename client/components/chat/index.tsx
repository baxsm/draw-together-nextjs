"use client";

import { FC, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MessageFeed from "./ChatFeed";
import MessageInput from "./MessageInput";
import { useChatStore } from "@/stores/chatStore";
import { socket } from "@/lib/socket";
import { useParams } from "next/navigation";
import Members from "./Members";

const ChatBox: FC = () => {
  const { roomId } = useParams();
  const { messages, setMessages } = useChatStore();

  useEffect(() => {
    socket.on("get-chat-state", () => {
      console.log("sending", messages);
      socket.emit("send-chat-state", { messages, roomId });
    });

    socket.on("chat-state-from-server", (messages: MessageType[]) => {
      console.log("chat state", messages);
      setMessages(messages);
    });

    return () => {
      socket.off("get-chat-state");
      socket.off("chat-state-from-server");
    };
  }, [setMessages, roomId, messages]);

  return (
    <div className="absolute right-4 bottom-4 z-20 max-w-xs w-full border dark:border-none rounded-2xl">
      <Accordion type="single" collapsible defaultValue="messages">
        <AccordionItem
          value="messages"
          className="border-none bg-background rounded-2xl"
        >
          <AccordionTrigger className="px-4">Messages</AccordionTrigger>
          <AccordionContent className="border-t">
            <Members />
            <MessageFeed />
            <MessageInput />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ChatBox;
