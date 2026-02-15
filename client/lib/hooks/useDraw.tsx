import { useCallback, useEffect, useRef, useState } from "react";

interface UseDrawOptions {
  onDraw: (draw: DrawProps) => void;
  onDrawStart?: (point: Point) => void;
  onDrawEnd?: (start: Point, end: Point) => void;
  onDrawPreview?: (start: Point, current: Point) => void;
}

export default function useDraw({
  onDraw,
  onDrawStart,
  onDrawEnd,
  onDrawPreview,
}: UseDrawOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPointRef = useRef<Point | undefined>(undefined);
  const startPointRef = useRef<Point | undefined>(undefined);

  const [mouseDown, setMouseDown] = useState(false);

  const computePointInCanvas = useCallback(
    (clientX: number, clientY: number) => {
      const canvasElement = canvasRef.current;
      if (!canvasElement) return;

      const rect = canvasElement.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      return { x, y };
    },
    [],
  );

  const onInteractStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      setMouseDown(true);

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const point = computePointInCanvas(clientX, clientY);

      if (point) {
        startPointRef.current = point;
        onDrawStart?.(point);
      }
    },
    [computePointInCanvas, onDrawStart],
  );

  useEffect(() => {
    const handleMove = (e: MouseEvent | AppTouchEvent) => {
      if (!mouseDown) return;

      const canvasElement = canvasRef.current;
      const ctx = canvasElement?.getContext("2d");
      let currentPoint: Point | undefined;

      if (e instanceof MouseEvent) {
        currentPoint = computePointInCanvas(e.clientX, e.clientY);
      } else {
        const { clientX, clientY } = e.touches[0];
        currentPoint = computePointInCanvas(clientX, clientY);
      }

      if (!ctx || !currentPoint) return;

      onDraw({ ctx, currentPoint, prevPoint: prevPointRef.current });
      prevPointRef.current = currentPoint;

      if (onDrawPreview && startPointRef.current) {
        onDrawPreview(startPointRef.current, currentPoint);
      }
    };

    const handleInteractEnd = (e: MouseEvent | TouchEvent) => {
      if (mouseDown && startPointRef.current) {
        let endPoint: Point | undefined;
        if (e instanceof MouseEvent) {
          endPoint = computePointInCanvas(e.clientX, e.clientY);
        } else if (e.changedTouches?.[0]) {
          endPoint = computePointInCanvas(
            e.changedTouches[0].clientX,
            e.changedTouches[0].clientY,
          );
        }
        if (endPoint && onDrawEnd) {
          onDrawEnd(startPointRef.current, endPoint);
        }
      }

      setMouseDown(false);
      prevPointRef.current = undefined;
      startPointRef.current = undefined;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleInteractEnd);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleInteractEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleInteractEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleInteractEnd);
    };
  }, [mouseDown, onDraw, onDrawEnd, onDrawPreview, computePointInCanvas]);

  return {
    canvasRef,
    onInteractStart,
  };
}
