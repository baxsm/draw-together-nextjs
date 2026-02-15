"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { socket } from "@/lib/socket";
import {
  type CreateRoomType,
  createRoomSchema,
} from "@/lib/validations/createRoom";
import { useMembersStore } from "@/stores/membersStore";
import { useUserStore } from "@/stores/userStore";
import CopyButton from "./CopyButton";
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
import { Label } from "./ui/label";

interface CreateRoomFormProps {
  roomId: string;
}

const CreateRoomForm: FC<CreateRoomFormProps> = ({ roomId }) => {
  const router = useRouter();

  const setUser = useUserStore((state) => state.setUser);
  const setMembers = useMembersStore((state) => state.setMembers);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<CreateRoomType>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: CreateRoomType) => {
    setIsLoading(true);
    socket.emit("create-room", {
      roomId,
      username: values.username,
      password: showPassword ? values.password : undefined,
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
      toast.error(`Failed to join room: ${message}`);
    });

    socket.on("invalid-data", ({ message }: { message: string }) => {
      toast.error(`Failed to join room: ${message}`);
    });

    return () => {
      socket.off("room-joined");
      socket.off("room-not-found");
      socket.off("invalid-data");
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="password-toggle"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="h-3.5 w-3.5 accent-primary"
          />
          <Label htmlFor="password-toggle" className="cursor-pointer text-xs">
            Password protect this room
          </Label>
        </div>

        {showPassword && (
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
                    placeholder="Room password"
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
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Create Room
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CreateRoomForm;
