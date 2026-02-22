"use client";

import {
  Circle,
  Eraser,
  type LucideIcon,
  Pencil,
  Pointer,
  Slash,
  Square,
} from "lucide-react";
import type { FC } from "react";
import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button } from "../ui/button";

const TOOLS: { tool: ToolType; icon: LucideIcon; label: string }[] = [
  { tool: "pen", icon: Pencil, label: "Pen" },
  { tool: "eraser", icon: Eraser, label: "Eraser" },
  { tool: "rectangle", icon: Square, label: "Rectangle" },
  { tool: "circle", icon: Circle, label: "Circle" },
  { tool: "line", icon: Slash, label: "Line" },
  { tool: "laser", icon: Pointer, label: "Laser" },
];

const ToolSelector: FC = () => {
  const tool = useCanvasStore((state) => state.tool);
  const setTool = useCanvasStore((state) => state.setTool);

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {TOOLS.map(({ tool: t, icon: Icon, label }) => (
        <Button
          key={t}
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 cursor-pointer",
            tool === t && "bg-primary/10 text-primary ring-1 ring-primary/30",
          )}
          onClick={() => setTool(t)}
          aria-label={label}
          title={label}
        >
          <Icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
};

export default ToolSelector;
