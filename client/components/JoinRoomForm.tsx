"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { type FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { socket } from "@/lib/socket";
import { type JoinRoomType, joinRoomSchema } from "@/lib/validations/joinRoom";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const JoinRoomForm: FC = () => {
  const [_isLoading, setIsLoading] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);

  const form = useForm<JoinRoomType>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      roomId: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: JoinRoomType) => {
    setIsLoading(true);
    socket.emit("join-room", {
      roomId: values.roomId,
      username: values.username,
      password: values.password || undefined,
    });
  };

  useEffect(() => {
    socket.on("room-not-found", () => {
      setIsLoading(false);
    });

    socket.on("password-required", () => {
      setNeedsPassword(true);
      setIsLoading(false);
    });

    socket.on("invalid-password", ({ message }: { message: string }) => {
      toast.error(message);
      setIsLoading(false);
    });

    return () => {
      socket.off("room-not-found");
      socket.off("password-required");
      socket.off("invalid-password");
    };
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full cursor-pointer">
          <LogIn className="mr-2 h-4 w-4" />
          Join a Room
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="pb-2">
          <DialogTitle>Join a Room</DialogTitle>
          <DialogDescription>
            Enter the room ID and your username to join.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-xs">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      className="h-9"
                      {...field}
                    />
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
                  <FormLabel className="font-medium text-xs">Room ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Paste room ID here"
                      className="h-9 font-mono text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {needsPassword && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-xs">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter room password"
                        className="h-9"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="mt-1 cursor-pointer">
              <LogIn className="mr-2 h-4 w-4" />
              Join Room
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinRoomForm;
