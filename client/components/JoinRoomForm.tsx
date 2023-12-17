"use client";

import { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { JoinRoomType, joinRoomSchema } from "@/lib/validations/joinRoom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { socket } from "@/lib/socket";
import { toast } from "sonner";

const JoinRoomForm: FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<JoinRoomType>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      roomId: "",
      username: "",
    },
  });

  const onSubmit = (values: JoinRoomType) => {
    setIsLoading(true);
    socket.emit("join-room", {
      roomId: values.roomId,
      username: values.username,
    });
  };

  useEffect(() => {
    socket.on("room-not-found", () => {
      toast.error("Room not found");
      setIsLoading(false);
    });

    return () => {
      socket.off("room-not-found");
    };
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Join a Room
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="pb-2">
          <DialogTitle>Join a Room</DialogTitle>
        </DialogHeader>

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
                  <FormControl>
                    <Input placeholder="j0hnd0e" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Room ID" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-2">
              Join Room
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinRoomForm;
