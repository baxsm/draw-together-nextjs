"use client";

import { Lock, Unlock } from "lucide-react";
import { useParams } from "next/navigation";
import type { FC } from "react";
import { socket } from "@/lib/socket";
import { useCanvasStore } from "@/stores/canvasStore";
import { useUserStore } from "@/stores/userStore";
import { Button } from "../ui/button";

const AdminControls: FC = () => {
  const { roomId } = useParams();
  const role = useUserStore((state) => state.role);
  const isLocked = useCanvasStore((state) => state.isLocked);

  if (role !== "admin") return null;

  return (
    <Button
      onClick={() => socket.emit("toggle-canvas-lock", { roomId })}
      variant={isLocked ? "destructive" : "outline"}
      size="sm"
      className="w-full cursor-pointer"
    >
      {isLocked ? (
        <>
          <Lock className="mr-1.5 h-3.5 w-3.5" /> Unlock Canvas
        </>
      ) : (
        <>
          <Unlock className="mr-1.5 h-3.5 w-3.5" /> Lock Canvas
        </>
      )}
    </Button>
  );
};

export default AdminControls;
