"use client";

import { socket } from "@/lib/socket";
import { useMembersStore } from "@/stores/membersStore";
import { FC, useEffect } from "react";
import { toast } from "sonner";

const Members: FC = () => {
  const { members, setMembers } = useMembersStore();

  useEffect(() => {
    socket.on("update-members", (members) => {
      setMembers(members);
    });

    socket.on("send-notification", ({ title, message }: NotificationType) => {
      toast(message);
    });

    return () => {
      socket.off("update-members");
      socket.off("send-notification");
    };
  }, [setMembers]);

  return (
    <div className="py-2 px-4 border-b flex flex-col gap-2">
      <h5 className="text-xs font-semibold">Members</h5>
      <p className="text-xs text-muted-foreground px-4">
        {members.map((e) => e.username).join(", ")}
      </p>
    </div>
  );
};

export default Members;
