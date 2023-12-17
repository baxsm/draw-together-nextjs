"use client";

import { FC } from "react";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { MessageSchemaType, messageSchema } from "@/lib/validations/message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Button } from "../ui/button";

interface MessageInputProps {}

const MessageInput: FC<MessageInputProps> = ({}) => {
  const form = useForm<MessageSchemaType>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  return (
    <Form {...form}>
      <form className="w-full px-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel />
              <FormControl>
                <div className="flex items-center gap-2 p-2 rounded-md border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
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
