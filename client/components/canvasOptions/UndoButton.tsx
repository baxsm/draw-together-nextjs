"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { RotateCcw } from "lucide-react";
import { cn, drawWithDataURL } from "@/lib/utils";
import { useCanvasStore } from "@/stores/canvasStore";
import { socket } from "@/lib/socket";
import { useParams } from "next/navigation";

const UndoButton: FC = () => {
  const { roomId } = useParams();
  const canvasRef = useCanvasStore((state) => state.canvasRef);

  const [isLoading, setIsLoading] = useState(false);

  const undo = useCallback(
    (undoPoint: string) => {
      const canvasElement = canvasRef.current;
      if (!canvasElement) return;

      const ctx = canvasElement.getContext("2d");
      if (!ctx) return;

      drawWithDataURL(undoPoint, ctx, canvasElement);
    },
    [canvasRef]
  );

  const undoCanvas = () => {
    setIsLoading(true);
    socket.emit("get-last-undo-point", roomId);
  };

  useEffect(() => {
    socket.on("last-undo-point-from-server", (lastUndoPoint: string) => {
      undo(lastUndoPoint);
      socket.emit("undo", {
        canvasState: lastUndoPoint,
        roomId,
      });

      socket.emit("delete-last-undo-point", roomId);
      setIsLoading(false);

      return () => {
        socket.off("last-undo-point-from-server");
      };
    });
  }, [roomId, undo]);

  return (
    <Button onClick={undoCanvas} variant="outline" className="flex-1">
      <RotateCcw className={cn("w-5 h-5 mr-1.5 duration-300")} />
      Undo
    </Button>
  );
};

export default UndoButton;
