"use client";

import { Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FC, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import useDraw from "@/lib/hooks/useDraw";
import useLaser from "@/lib/hooks/useLaser";
import { socket } from "@/lib/socket";
import { draw, drawWithDataURL } from "@/lib/utils";
import { useCanvasStore } from "@/stores/canvasStore";
import { useChatStore } from "@/stores/chatStore";
import { useCursorsStore } from "@/stores/cursorStore";
import { useMembersStore } from "@/stores/membersStore";
import { useUserStore } from "@/stores/userStore";
import CursorOverlay from "./CursorOverlay";
import TextInput from "./TextInput";

interface DrawingCanvasProps {
  roomId: string;
}

const SHAPE_TOOLS = new Set<ToolType>(["rectangle", "circle", "line"]);
const IDLE_TIMEOUT = 30000;

const DrawingCanvas: FC<DrawingCanvasProps> = ({ roomId }) => {
  const router = useRouter();

  const [isCanvasLoading, setIsCanvasLoading] = useState(true);
  const [textInput, setTextInput] = useState<{ position: Point } | null>(null);

  const localContainerRef = useRef<HTMLDivElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  const tool = useCanvasStore((state) => state.tool);
  const strokeColor = useCanvasStore((state) => state.strokeColor);
  const strokeWidth = useCanvasStore((state) => state.strokeWidth);
  const dashGap = useCanvasStore((state) => state.dashGap);
  const fontSize = useCanvasStore((state) => state.fontSize);
  const isLocked = useCanvasStore((state) => state.isLocked);
  const setIsLocked = useCanvasStore((state) => state.setIsLocked);
  const user = useUserStore((state) => state.user);
  const role = useUserStore((state) => state.role);
  const setRole = useUserStore((state) => state.setRole);
  const setUser = useUserStore((state) => state.setUser);

  const setCanvasRef = useCanvasStore((state) => state.setCanvasRef);

  const setCursor = useCursorsStore((state) => state.setCursor);
  const removeCursor = useCursorsStore((state) => state.removeCursor);
  const clearCursors = useCursorsStore((state) => state.clearCursors);
  const setPresence = useMembersStore((state) => state.setPresence);
  const lastEmitRef = useRef(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { addSegment } = useLaser(overlayCanvasRef);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      socket.emit("presence-update", { roomId, status: "idle" });
    }, IDLE_TIMEOUT);
  }, [roomId]);

  const emitPresence = useCallback(
    (status: PresenceStatus) => {
      socket.emit("presence-update", { roomId, status });
      if (status !== "idle") resetIdleTimer();
    },
    [roomId, resetIdleTimer],
  );

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [router, user]);

  const emitDraw = useCallback(
    (drawOptions: Omit<DrawOptions, "ctx">) => {
      socket.emit("draw", { drawOptions, roomId });
    },
    [roomId],
  );

  const onDraw = useCallback(
    ({ ctx, currentPoint, prevPoint }: DrawProps) => {
      if (SHAPE_TOOLS.has(tool) || tool === "text") return;

      if (tool === "laser") {
        if (prevPoint) {
          addSegment(prevPoint, currentPoint, strokeColor, strokeWidth[0]);
        }
        emitDraw({
          tool,
          currentPoint,
          prevPoint,
          strokeColor,
          strokeWidth,
          dashGap,
        });
        return;
      }

      const drawOptions: DrawOptions = {
        tool,
        ctx,
        currentPoint,
        prevPoint,
        strokeColor,
        strokeWidth,
        dashGap,
      };
      draw(drawOptions);

      const { ctx: _, ...networkOptions } = drawOptions;
      emitDraw(networkOptions);
    },
    [tool, strokeColor, strokeWidth, dashGap, emitDraw, addSegment],
  );

  const onDrawStart = useCallback(
    (point: Point) => {
      if (tool === "text") {
        setTextInput({ position: point });
      }
    },
    [tool],
  );

  const onDrawPreview = useCallback(
    (startPoint: Point, currentPoint: Point) => {
      if (!SHAPE_TOOLS.has(tool)) return;

      const overlayCtx = overlayCanvasRef.current?.getContext("2d");
      if (!overlayCtx || !overlayCanvasRef.current) return;

      overlayCtx.clearRect(
        0,
        0,
        overlayCanvasRef.current.width,
        overlayCanvasRef.current.height,
      );

      overlayCtx.globalAlpha = 0.5;
      draw({
        tool,
        ctx: overlayCtx,
        currentPoint,
        prevPoint: undefined,
        startPoint,
        endPoint: currentPoint,
        strokeColor,
        strokeWidth,
        dashGap,
      });
      overlayCtx.globalAlpha = 1.0;
    },
    [tool, strokeColor, strokeWidth, dashGap],
  );

  const onDrawEnd = useCallback(
    (startPoint: Point, endPoint: Point) => {
      if (!SHAPE_TOOLS.has(tool)) return;

      const overlayCtx = overlayCanvasRef.current?.getContext("2d");
      if (overlayCtx && overlayCanvasRef.current) {
        overlayCtx.clearRect(
          0,
          0,
          overlayCanvasRef.current.width,
          overlayCanvasRef.current.height,
        );
      }

      const canvasElement = canvasRef.current;
      const ctx = canvasElement?.getContext("2d");
      if (!ctx) return;

      const drawOptions: DrawOptions = {
        tool,
        ctx,
        currentPoint: endPoint,
        prevPoint: undefined,
        startPoint,
        endPoint,
        strokeColor,
        strokeWidth,
        dashGap,
      };
      draw(drawOptions);

      const { ctx: _, ...networkOptions } = drawOptions;
      emitDraw(networkOptions);
    },
    [tool, strokeColor, strokeWidth, dashGap, emitDraw],
  );

  const { canvasRef, onInteractStart } = useDraw({
    onDraw,
    onDrawStart,
    onDrawEnd,
    onDrawPreview,
  });

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
      if (drawOptions.tool === "laser") {
        if (drawOptions.prevPoint) {
          addSegment(
            drawOptions.prevPoint,
            drawOptions.currentPoint,
            drawOptions.strokeColor,
            drawOptions.strokeWidth[0],
          );
        }
        return;
      }

      if (!ctx) return;
      draw({ ...drawOptions, ctx });
    });

    socket.on("undo-canvas", (canvasState) => {
      if (!ctx || !canvasElement) return;

      drawWithDataURL(canvasState, ctx, canvasElement);
    });

    socket.on("cursor-update", (data: CursorData) => {
      setCursor(data.userId, data);
    });

    socket.on("cursor-leave", (userId: string) => {
      removeCursor(userId);
    });

    socket.on(
      "user-presence",
      ({ userId, status }: { userId: string; status: PresenceStatus }) => {
        setPresence(userId, status);
      },
    );

    socket.on("kicked", ({ message }: { message: string }) => {
      toast.error(message);
      setUser(null);
      useMembersStore.getState().setMembers([]);
      useChatStore.getState().setMessages([]);
      useCanvasStore.getState().setIsLocked(false);
      router.replace("/");
    });

    socket.on("role-changed", ({ role }: { role: UserRole }) => {
      setRole(role);
    });

    socket.on("canvas-lock-changed", ({ locked }: { locked: boolean }) => {
      setIsLocked(locked);
    });

    return () => {
      socket.off("get-canvas-state");
      socket.off("client-loaded");
      socket.off("canvas-state-from-server");
      socket.off("update-canvas-state");
      socket.off("undo-canvas");
      socket.off("cursor-update");
      socket.off("cursor-leave");
      socket.off("user-presence");
      socket.off("kicked");
      socket.off("role-changed");
      socket.off("canvas-lock-changed");
    };
  }, [canvasRef, roomId, setCursor, removeCursor, addSegment, setPresence, setUser, setRole, setIsLocked, router]);

  useEffect(() => {
    const setCanvasDimensions = () => {
      if (!localContainerRef.current || !canvasRef.current) return;

      const { width, height } =
        localContainerRef.current.getBoundingClientRect();

      canvasRef.current.width = width;
      canvasRef.current.height = height;

      if (overlayCanvasRef.current) {
        overlayCanvasRef.current.width = width;
        overlayCanvasRef.current.height = height;
      }
    };

    setCanvasDimensions();
  }, [canvasRef]);

  useEffect(() => {
    const container = localContainerRef.current;
    if (!container) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const now = Date.now();
      if (now - lastEmitRef.current < 50) return;
      lastEmitRef.current = now;

      const canvasElement = canvasRef.current;
      if (!canvasElement) return;

      const rect = canvasElement.getBoundingClientRect();
      const clientX =
        e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      const clientY =
        e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

      socket.emit("cursor-move", {
        x: clientX - rect.left,
        y: clientY - rect.top,
        roomId,
      });
      emitPresence("active");
    };

    const handlePointerLeave = () => {
      socket.emit("cursor-move", { x: -100, y: -100, roomId });
    };

    const handlePointerUp = () => {
      emitPresence("active");
    };

    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("touchmove", handlePointerMove);
    container.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchend", handlePointerUp);

    return () => {
      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("touchmove", handlePointerMove);
      container.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [canvasRef, roomId, emitPresence]);

  useEffect(() => {
    return () => {
      clearCursors();
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [clearCursors]);

  const canvasDisabled = isLocked && role !== "admin";

  const handleInteractStart = (e: React.MouseEvent | React.TouchEvent) => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    if (canvasDisabled) return;

    emitPresence("drawing");

    if (tool !== "laser" && tool !== "text") {
      socket.emit("add-undo-point", {
        roomId,
        undoPoint: canvasElement.toDataURL(),
      });
    }

    onInteractStart(e);
  };

  const handleTextSubmit = useCallback(
    (text: string) => {
      if (!textInput) return;

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

      const canvasElement = canvasRef.current;
      if (canvasElement) {
        socket.emit("add-undo-point", {
          roomId,
          undoPoint: canvasElement.toDataURL(),
        });
      }

      const drawOptions: DrawOptions = {
        tool: "text",
        ctx,
        currentPoint: textInput.position,
        prevPoint: undefined,
        strokeColor,
        strokeWidth,
        dashGap,
        text,
        fontSize: fontSize[0],
      };
      draw(drawOptions);

      const { ctx: _, ...networkOptions } = drawOptions;
      emitDraw(networkOptions);
    },
    [textInput, strokeColor, strokeWidth, dashGap, fontSize, roomId, emitDraw],
  );

  const cursorStyle =
    tool === "text"
      ? "text"
      : tool === "eraser"
        ? `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="black" stroke-width="1.5"/></svg>') 12 12, auto`
        : "crosshair";

  return (
    <div
      ref={localContainerRef}
      className="relative flex h-full w-full items-center justify-center"
    >
      {isCanvasLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Loading canvas...</p>
          </div>
        </div>
      )}
      <canvas
        id="canvas"
        ref={canvasRef}
        onMouseDown={handleInteractStart}
        onTouchStart={handleInteractStart}
        width={0}
        height={0}
        className="h-full w-full touch-none rounded-none bg-white"
        style={{ cursor: cursorStyle }}
      />
      <canvas
        ref={overlayCanvasRef}
        width={0}
        height={0}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      {textInput && tool === "text" && (
        <TextInput
          position={textInput.position}
          strokeColor={strokeColor}
          fontSize={fontSize[0]}
          onSubmit={handleTextSubmit}
          onCancel={() => setTextInput(null)}
        />
      )}
      <CursorOverlay />
      {canvasDisabled && (
        <div className="absolute top-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-lg border border-border/60 bg-background/80 px-3 py-1.5 shadow-lg backdrop-blur-sm">
          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground text-xs">Canvas locked by admin</span>
        </div>
      )}
    </div>
  );
};

export default DrawingCanvas;
