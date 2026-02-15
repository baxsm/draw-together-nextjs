"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CopyButton from "@/components/CopyButton";
import { socket } from "@/lib/socket";
import { type JoinRoomType, joinRoomSchema } from "@/lib/validations/joinRoom";
import { useMembersStore } from "@/stores/membersStore";
import { useUserStore } from "@/stores/userStore";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

interface JoinRoomFormWithIdProps {
  roomId: string;
}

const JoinRoomFormWithId: FC<JoinRoomFormWithIdProps> = ({ roomId }) => {
  const router = useRouter();

  const setUser = useUserStore((state) => state.setUser);
  const setMembers = useMembersStore((state) => state.setMembers);

  const [isLoading, setIsLoading] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);

  const form = useForm<JoinRoomType>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      roomId,
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
    socket.on("room-joined", ({ user, roomId, members }: RoomJoinedType) => {
      setUser(user);
      setMembers(members);
      router.replace(`/${roomId}`);
      toast.success(`Welcome ${user.username}`);
    });

    socket.on("room-not-found", ({ message }: { message: string }) => {
      toast.error(`Room not found: ${message}`);
      setIsLoading(false);
    });

    socket.on("invalid-data", ({ message }: { message: string }) => {
      toast.error(`Failed to join room: ${message}`);
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
      socket.off("room-joined");
      socket.off("room-not-found");
      socket.off("invalid-data");
      socket.off("password-required");
      socket.off("invalid-password");
    };
  }, [router, setUser, setMembers]);

  return (
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
              <FormLabel className="font-medium text-foreground text-xs">
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

        <FormItem>
          <FormLabel className="font-medium text-foreground text-xs">
            Room ID
          </FormLabel>
          <div className="flex items-center gap-1 rounded-md border border-input bg-muted/50">
            <Input
              value={roomId}
              readOnly
              disabled
              className="h-9 border-none bg-transparent font-mono text-xs disabled:opacity-70"
            />
            <CopyButton value={roomId} />
          </div>
        </FormItem>

        {needsPassword && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-foreground text-xs">
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

        <Button
          disabled={isLoading}
          type="submit"
          className="mt-1 w-full cursor-pointer"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Join Room
        </Button>
      </form>
    </Form>
  );
};

export default JoinRoomFormWithId;
