"use client";

import { Crown, MoreHorizontal, ShieldCheck, UserX, Users } from "lucide-react";
import { useParams } from "next/navigation";
import type { FC } from "react";
import { socket } from "@/lib/socket";
import { cn } from "@/lib/utils";
import { useMembersStore } from "@/stores/membersStore";
import { useUserStore } from "@/stores/userStore";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const statusColor: Record<PresenceStatus, string> = {
  drawing: "bg-green-500",
  active: "bg-blue-500",
  idle: "bg-muted-foreground/40",
};

const Members: FC = () => {
  const { roomId } = useParams();
  const { members, presenceMap } = useMembersStore();
  const currentUser = useUserStore((state) => state.user);
  const role = useUserStore((state) => state.role);
  const isCurrentAdmin = role === "admin";

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <Users className="h-3 w-3 text-muted-foreground" />
      <div className="flex flex-wrap gap-1">
        {members.map((member) => {
          const status = presenceMap.get(member.id) ?? "active";
          const isSelf = member.id === currentUser?.id;
          const memberIsAdmin = member.role === "admin";

          return (
            <span
              key={member.id}
              className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs"
            >
              <span
                className={cn("h-1.5 w-1.5 rounded-full", statusColor[status])}
              />
              {memberIsAdmin && (
                <Crown className="h-2.5 w-2.5 text-yellow-500" />
              )}
              {member.username}
              {isCurrentAdmin && !isSelf && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-0.5 h-3.5 w-3.5 cursor-pointer p-0"
                    >
                      <MoreHorizontal className="h-2.5 w-2.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-36">
                    <DropdownMenuItem
                      className="cursor-pointer text-xs"
                      onClick={() =>
                        socket.emit("promote-user", {
                          userId: member.id,
                          roomId,
                        })
                      }
                    >
                      <ShieldCheck className="mr-1.5 h-3 w-3" />
                      Promote
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer text-xs text-destructive focus:text-destructive"
                      onClick={() =>
                        socket.emit("kick-user", {
                          userId: member.id,
                          roomId,
                        })
                      }
                    >
                      <UserX className="mr-1.5 h-3 w-3" />
                      Kick
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default Members;
