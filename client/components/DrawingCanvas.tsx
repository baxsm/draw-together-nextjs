"use client";

import useDraw from "@/lib/hooks/useDraw";
import { socket } from "@/lib/socket";
import { draw, drawWithDataURL } from "@/lib/utils";
import { useCanvasStore } from "@/stores/canvasStore";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface DrawingCanvasProps {
  roomId: string;
}

const DrawingCanvas: FC<DrawingCanvasProps> = ({ roomId }) => {
  const router = useRouter();

  const [isCanvasLoading, setIsCanvasLoading] = useState(true);

  const localContainerRef = useRef<HTMLDivElement>(null);

  const strokeColor = useCanvasStore((state) => state.strokeColor);
  const strokeWidth = useCanvasStore((state) => state.strokeWidth);
  const dashGap = useCanvasStore((state) => state.dashGap);
  const user = useUserStore((state) => state.user);

  const setCanvasRef = useCanvasStore((state) => state.setCanvasRef);

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [router, user]);

  const onDraw = useCallback(
    ({ ctx, currentPoint, prevPoint }: DrawProps) => {
      const drawOptions = {
        ctx,
        currentPoint,
        prevPoint,
        strokeColor,
        strokeWidth,
        dashGap,
      };
      draw(drawOptions);
      socket.emit("draw", { drawOptions, roomId });
    },
    [strokeColor, strokeWidth, dashGap, roomId]
  );

  const { canvasRef, onInteractStart } = useDraw(onDraw);

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasRef(canvasRef);
    }
  }, [canvasRef, setCanvasRef]);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const ctx = canvasElement?.getContext("2d");

    socket.emit("client-ready", roomId);

    socket.on("client-loaded", () => {
      setIsCanvasLoading(false);
    });

    socket.on("get-canvas-state", () => {
      const canvasState = canvasRef.current?.toDataURL();
      if (!canvasState) return;

      socket.emit("send-canvas-state", { canvasState, roomId });
    });

    socket.on("canvas-state-from-server", (canvasState: string) => {
      if (!ctx || !canvasElement) return;

      drawWithDataURL(canvasState, ctx, canvasElement);
      setIsCanvasLoading(false);
    });

    socket.on("update-canvas-state", (drawOptions: DrawOptions) => {
      if (!ctx) return;
      draw({ ...drawOptions, ctx });
    });

    socket.on("undo-canvas", (canvasState) => {
      if (!ctx || !canvasElement) return;

      drawWithDataURL(canvasState, ctx, canvasElement);
    });

    return () => {
      socket.off("get-canvas-state");
      socket.off("client-loaded");
      socket.off("canvas-state-from-server");
      socket.off("update-canvas-state");
      socket.off("undo-canvas");
    };
  }, [canvasRef, roomId]);

  useEffect(() => {
    const setCanvasDimensions = () => {
      if (!localContainerRef.current || !canvasRef.current) return;

      const { width, height } =
        localContainerRef.current?.getBoundingClientRect();

      canvasRef.current.width = width;
      canvasRef.current.height = height;
    };

    setCanvasDimensions();
  }, [canvasRef]);

  const handleInteractStart = () => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) {
      console.log("no element");
      return;
    }

    socket.emit("add-undo-point", {
      roomId,
      undoPoint: canvasElement.toDataURL(),
    });
    onInteractStart();
  };

  return (
    <div
      ref={localContainerRef}
      className="relative flex h-full w-full items-center justify-center"
    >
      {isCanvasLoading && (
        <Skeleton className="absolute h-[100vh-1rem] w-[100vw-16rem]" />
      )}
      <canvas
        id="canvas"
        ref={canvasRef}
        onMouseDown={handleInteractStart}
        onTouchStart={handleInteractStart}
        width={0}
        height={0}
        className="touch-none w-full h-full bg-white"
      />
    </div>
  );
};

export default DrawingCanvas;
