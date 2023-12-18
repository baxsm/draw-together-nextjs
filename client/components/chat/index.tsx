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
import { useMembersStore } from "@/stores/membersStore";
import { toast } from "sonner";

const ChatBox: FC = () => {
  const { roomId } = useParams();
  const { messages, setMessages, addMessage } = useChatStore();
  const { setMembers } = useMembersStore();

  useEffect(() => {
    socket.on("get-chat-state", () => {
      console.log("sending", messages);
      socket.emit("send-chat-state", { messages, roomId });
    });

    socket.on("chat-state-from-server", (messages: MessageType[]) => {
      console.log("chat state", messages);
      setMessages(messages);
    });

    socket.on("chat-message-from-server", (message: MessageType) => {
      addMessage(message);
    });

    socket.on("update-members", (members) => {
      setMembers(members);
    });

    socket.on("send-notification", ({ title, message }: NotificationType) => {
      toast(message);
    });

    return () => {
      socket.off("get-chat-state");
      socket.off("chat-state-from-server");
      socket.off("chat-message-from-server");
      socket.off("update-members");
      socket.off("send-notification");
    };
  }, [setMessages, addMessage, setMembers, roomId, messages]);

  return (
    <div className="absolute right-4 bottom-4 z-20 max-w-xs w-full border dark:border-none rounded-2xl">
      <Accordion type="single" collapsible>
        <AccordionItem
          className="border-none bg-background rounded-2xl"
          value="chat"
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
