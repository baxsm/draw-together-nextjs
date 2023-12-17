"use client";

import { CreateRoomType, createRoomSchema } from "@/lib/validations/createRoom";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import CopyButton from "./CopyButton";

interface CreateRoomFormProps {
  roomId: string;
}

const CreateRoomForm: FC<CreateRoomFormProps> = ({ roomId }) => {
  const form = useForm<CreateRoomType>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = (values: CreateRoomType) => {};

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Username</FormLabel>
              <FormControl>
                <Input placeholder="j0hnd0e" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel className="text-foreground">Room ID</FormLabel>
          <div className="flex items-center border rounded-md">
            <Input value={roomId} readOnly disabled className="border-none" />
            <CopyButton value={roomId} />
          </div>
        </FormItem>

        <Button type="submit" className="mt-2 w-full">
          Create a Room
        </Button>
      </form>
    </Form>
  );
};

export default CreateRoomForm;
