"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useParams } from "next/navigation";
import { type FC, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { replaceShortcodes } from "@/lib/emoji";
import { socket } from "@/lib/socket";
import { cn } from "@/lib/utils";
import {
  type MessageSchemaType,
  messageSchema,
} from "@/lib/validations/message";
import { useChatStore } from "@/stores/chatStore";
import { useMembersStore } from "@/stores/membersStore";
import { useUserStore } from "@/stores/userStore";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import EmojiPicker from "./EmojiPicker";

const TYPING_TIMEOUT = 2000;

const MessageInput: FC = () => {
  const { roomId } = useParams();
  const [_isLoading, setIsLoading] = useState(false);
  const { members } = useMembersStore();
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { addMessage } = useChatStore();
  const user = useUserStore((state) => state.user);

  const form = useForm<MessageSchemaType>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    socket.emit("typing", { roomId, isTyping: false });
  }, [roomId]);

  const handleInputChange = useCallback(() => {
    socket.emit("typing", { roomId, isTyping: true });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(stopTyping, TYPING_TIMEOUT);
  }, [roomId, stopTyping]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const onEmojiSelect = (emoji: string) => {
    const current = form.getValues("content");
    form.setValue("content", current + emoji);
    handleInputChange();
  };

  const onSubmit = (values: MessageSchemaType) => {
    if (!user) {
      return;
    }

    stopTyping();
    setIsLoading(true);

    const newMessage: MessageType = {
      content: replaceShortcodes(values.content),
      createdAt: new Date().toISOString(),
      id: crypto.randomUUID(),
      userId: user.id,
      username: user.username,
    };

    socket.emit("send-chat-message", {
      message: newMessage,
      roomId,
    });

    addMessage(newMessage);

    form.reset({
      content: "",
    });

    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("border-t px-3 py-2", {
          "pointer-events-none opacity-40": members.length === 1,
        })}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-1.5">
                  <Input
                    disabled={members.length === 1}
                    placeholder="Type a message..."
                    aria-autocomplete="none"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleInputChange();
                    }}
                    className="h-8 border-none bg-transparent p-0 text-xs shadow-none outline-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        onSubmit(form.getValues());
                      }
                    }}
                  />
                  <EmojiPicker
                    onSelect={onEmojiSelect}
                    disabled={members.length === 1}
                  />
                  <Button
                    disabled={members.length === 1}
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
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
