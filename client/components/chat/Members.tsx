"use client";

import { useMembersStore } from "@/stores/membersStore";
import { FC } from "react";

const Members: FC = () => {
  const { members } = useMembersStore();

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
