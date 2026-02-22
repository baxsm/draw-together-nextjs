import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getCursorColor } from "./cursorColors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function drawFreehand(options: DrawOptions) {
  const { ctx, currentPoint, prevPoint, strokeColor, strokeWidth, dashGap } =
    options;
  const start = prevPoint ?? currentPoint;

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth[0];
  ctx.setLineDash(dashGap);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(currentPoint.x, currentPoint.y);
  ctx.stroke();
}

function drawEraser(options: DrawOptions) {
  const { ctx } = options;
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  drawFreehand(options);
  ctx.restore();
}

function drawRectangle(options: DrawOptions) {
  const { ctx, startPoint, endPoint, strokeColor, strokeWidth, dashGap } =
    options;
  if (!startPoint || !endPoint) return;

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth[0];
  ctx.setLineDash(dashGap);
  ctx.lineJoin = "miter";
  ctx.lineCap = "square";

  ctx.beginPath();
  ctx.rect(
    startPoint.x,
    startPoint.y,
    endPoint.x - startPoint.x,
    endPoint.y - startPoint.y,
  );
  ctx.stroke();
}

function drawCircle(options: DrawOptions) {
  const { ctx, startPoint, endPoint, strokeColor, strokeWidth, dashGap } =
    options;
  if (!startPoint || !endPoint) return;

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth[0];
  ctx.setLineDash(dashGap);

  const rx = (endPoint.x - startPoint.x) / 2;
  const ry = (endPoint.y - startPoint.y) / 2;
  const cx = startPoint.x + rx;
  const cy = startPoint.y + ry;

  ctx.beginPath();
  ctx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2);
  ctx.stroke();
}

function drawLine(options: DrawOptions) {
  const { ctx, startPoint, endPoint, strokeColor, strokeWidth, dashGap } =
    options;
  if (!startPoint || !endPoint) return;

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth[0];
  ctx.setLineDash(dashGap);
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.stroke();
}

export function draw(options: DrawOptions) {
  const { ctx, userId } = options;

  if (userId) {
    ctx.shadowColor = getCursorColor(userId);
    ctx.shadowBlur = 4;
  }

  switch (options.tool) {
    case "eraser":
      drawEraser(options);
      break;
    case "rectangle":
      drawRectangle(options);
      break;
    case "circle":
      drawCircle(options);
      break;
    case "line":
      drawLine(options);
      break;
    case "laser":
      drawFreehand(options);
      break;
    default:
      drawFreehand(options);
      break;
  }

  if (userId) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }
}

export function drawWithDataURL(
  dataURL: string,
  ctx: CanvasRenderingContext2D,
  canvasElement: HTMLCanvasElement,
) {
  const img = new Image();
  img.src = dataURL;
  img.onload = () => {
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    ctx.drawImage(img, 0, 0);
  };
}

export function isMacOS() {
  if (typeof navigator === "undefined") return false;
  return navigator.userAgent?.includes("Mac");
}

export function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffSeconds = Math.floor((now - then) / 1000);

  if (diffSeconds < 5) return "just now";
  if (diffSeconds < 60) return `${diffSeconds}s ago`;

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return new Date(isoString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
