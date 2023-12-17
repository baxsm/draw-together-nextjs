"use client";

import { CreateRoomType, createRoomSchema } from "@/lib/validations/createRoom";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";
import { useMembersStore } from "@/stores/membersStore";
import { socket } from "@/lib/socket";
import { Loader2 } from "lucide-react";

interface CreateRoomFormProps {
  roomId: string;
}

const CreateRoomForm: FC<CreateRoomFormProps> = ({ roomId }) => {
  const router = useRouter();

  const setUser = useUserStore((state) => state.setUser);
  const setMembers = useMembersStore((state) => state.setMembers);

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateRoomType>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = (values: CreateRoomType) => {
    setIsLoading(true);
    socket.emit("create-room", { roomId, username: values.username });
  };

  useEffect(() => {
    socket.on("room-joined", ({ user, roomId, members }: RoomJoinedType) => {
      setUser(user);
      setMembers(members);
      router.replace(`/${roomId}`);
      toast.success(`Welcome ${user.username}`)
    });

    socket.on("room-not-found", ({ message }: { message: string }) => {
      toast.error(`Failed to join room : ${message}`);
    });

    socket.on("invalid-data", ({ message }: { message: string }) => {
      toast.error(`Failed to join room : ${message}`);
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

        <Button disabled={isLoading} type="submit" className="mt-2 w-full">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>Create a Room</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CreateRoomForm;
