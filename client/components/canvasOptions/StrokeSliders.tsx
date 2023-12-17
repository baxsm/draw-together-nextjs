import { FC } from "react";
import { Label } from "../ui/label";
import { useCanvasStore } from "@/stores/canvasStore";
import { Slider } from "../ui/slider";

const StrokeSliders: FC = () => {
  const [strokeWidth, setStrokeWidth] = useCanvasStore((state) => [
    state.strokeWidth,
    state.setStrokeWidth,
  ]);

  const [dashGap, setDashGap] = useCanvasStore((state) => [
    state.dashGap,
    state.setDashGap,
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs select-none">Stroke Width</Label>
          <span className="text-xs text-muted-foreground">{strokeWidth}</span>
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
          <Label className="text-xs select-none">Dash Gap</Label>
          <span className="text-xs text-muted-foreground">{dashGap}</span>
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
    </div>
  );
};

export default StrokeSliders;
