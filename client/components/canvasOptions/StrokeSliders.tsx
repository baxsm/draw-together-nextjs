import type { FC } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

const StrokeSliders: FC = () => {
  const tool = useCanvasStore((state) => state.tool);

  const strokeWidth = useCanvasStore((state) => state.strokeWidth);
  const setStrokeWidth = useCanvasStore((state) => state.setStrokeWidth);

  const dashGap = useCanvasStore((state) => state.dashGap);
  const setDashGap = useCanvasStore((state) => state.setDashGap);

  const fontSize = useCanvasStore((state) => state.fontSize);
  const setFontSize = useCanvasStore((state) => state.setFontSize);

  return (
    <div className="flex flex-col gap-4">
      {tool === "text" ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Label className="select-none text-xs">Font Size</Label>
            <span className="text-muted-foreground text-xs">{fontSize}</span>
          </div>
          <Slider
            min={8}
            max={72}
            step={1}
            value={fontSize}
            onValueChange={setFontSize}
            className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
            aria-label="Font size"
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Label className="select-none text-xs">Stroke Width</Label>
              <span className="text-muted-foreground text-xs">
                {strokeWidth}
              </span>
            </div>
            <Slider
              min={1}
              max={50}
              step={1}
              value={strokeWidth}
              onValueChange={setStrokeWidth}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Stroke width"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Label className="select-none text-xs">Dash Gap</Label>
              <span className="text-muted-foreground text-xs">{dashGap}</span>
            </div>
            <Slider
              min={0}
              max={50}
              step={1}
              value={dashGap}
              onValueChange={setDashGap}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Dash gap"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default StrokeSliders;
