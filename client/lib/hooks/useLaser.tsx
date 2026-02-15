import { type RefObject, useCallback, useEffect, useRef } from "react";

interface LaserSegment {
  from: Point;
  to: Point;
}

interface LaserStroke {
  segments: LaserSegment[];
  timestamp: number;
  color: string;
  width: number;
}

const FADE_DURATION = 2000;

export default function useLaser(
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>,
) {
  const strokesRef = useRef<LaserStroke[]>([]);
  const animFrameRef = useRef<number>(0);

  const addSegment = useCallback(
    (from: Point, to: Point, color: string, width: number) => {
      const now = Date.now();
      const strokes = strokesRef.current;
      const last = strokes[strokes.length - 1];

      if (last && now - last.timestamp < 100) {
        last.segments.push({ from, to });
        last.timestamp = now;
      } else {
        strokes.push({
          segments: [{ from, to }],
          timestamp: now,
          color,
          width,
        });
      }
    },
    [],
  );

  useEffect(() => {
    const animate = () => {
      const canvas = overlayCanvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (!ctx || !canvas) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const now = Date.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      strokesRef.current = strokesRef.current.filter(
        (s) => now - s.timestamp < FADE_DURATION,
      );

      for (const stroke of strokesRef.current) {
        const elapsed = now - stroke.timestamp;
        const opacity = Math.max(0, 1 - elapsed / FADE_DURATION);

        ctx.globalAlpha = opacity;
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        for (const seg of stroke.segments) {
          ctx.moveTo(seg.from.x, seg.from.y);
          ctx.lineTo(seg.to.x, seg.to.y);
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [overlayCanvasRef]);

  return { addSegment };
}
