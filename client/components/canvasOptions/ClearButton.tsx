"use client";

import { Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { type FC, useCallback, useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button } from "../ui/button";

const ClearButton: FC = () => {
  const { roomId } = useParams();
  const canvasRef = useCanvasStore((state) => state.canvasRef);

  const [isLoading, setIsLoading] = useState(false);

  const clear = useCallback(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const ctx = canvasElement.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  }, [canvasRef]);

  const clearCanvas = () => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) {
      return;
    }

    setIsLoading(true);

    socket.emit("add-undo-point", {
      roomId,
      undoPoint: canvasElement.toDataURL(),
    });
    clear();
    socket.emit("clear-canvas", roomId);
    setIsLoading(false);
  };

  useEffect(() => {
    socket.on("clear-canvas", clear);

    return () => {
      socket.off("clear-canvas");
    };
  }, [clear]);

  return (
    <Button
      disabled={isLoading}
      onClick={clearCanvas}
      variant="destructive"
      size="sm"
      className="flex-1 cursor-pointer"
    >
      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
      Clear
    </Button>
  );
};

export default ClearButton;
