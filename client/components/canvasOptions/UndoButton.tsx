"use client";

import { RotateCcw } from "lucide-react";
import { useParams } from "next/navigation";
import { type FC, useCallback, useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { drawWithDataURL } from "@/lib/utils";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button } from "../ui/button";

const UndoButton: FC = () => {
  const { roomId } = useParams();
  const canvasRef = useCanvasStore((state) => state.canvasRef);

  const [_isLoading, setIsLoading] = useState(false);

  const undo = useCallback(
    (undoPoint: string) => {
      const canvasElement = canvasRef.current;
      if (!canvasElement) return;

      const ctx = canvasElement.getContext("2d");
      if (!ctx) return;

      drawWithDataURL(undoPoint, ctx, canvasElement);
    },
    [canvasRef],
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
    <Button
      onClick={undoCanvas}
      variant="outline"
      size="sm"
      className="flex-1 cursor-pointer"
    >
      <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
      Undo
    </Button>
  );
};

export default UndoButton;
