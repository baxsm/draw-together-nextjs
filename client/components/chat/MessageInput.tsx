"use client";

import { FC, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { MessageSchemaType, messageSchema } from "@/lib/validations/message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { useChatStore } from "@/stores/chatStore";
import { socket } from "@/lib/socket";
import { useParams } from "next/navigation";
import { useUserStore } from "@/stores/userStore";

interface MessageInputProps {}

const MessageInput: FC<MessageInputProps> = ({}) => {
  const { roomId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const { messages, addMessage } = useChatStore();
  const user = useUserStore((state) => state.user);

  const form = useForm<MessageSchemaType>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (values: MessageSchemaType) => {
    if (!user) {
      return;
    }

    setIsLoading(true);
    const newMessage: MessageType = {
      content: values.content,
      createdAt: new Date().toISOString(),
      id: crypto.randomUUID(),
      userId: user.id,
    };
    socket.emit("send-chat-message", {
      message: newMessage,
      roomId,
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  useEffect(() => {
    socket.on("chat-message-from-server", (message: MessageType) => {
      addMessage(message);
    });
  }, [messages, roomId, addMessage]);

  console.log(messages);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full px-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel />
              <FormControl>
                <div className="flex items-center gap-2 px-2 py-1 rounded-md border ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <Input
                    placeholder="say Hi!"
                    {...field}
                    className="border-none focus-visible:ring-0 ring-0 outline-none p-0 rounded-none"
                  />
                  <Button type="submit" size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default MessageInput;
