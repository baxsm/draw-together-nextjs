import { Download } from "lucide-react";
import type { FC } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button } from "../ui/button";

const SaveCanvasButton: FC = () => {
  const canvasRef = useCanvasStore((state) => state.canvasRef);

  const saveCanvas = () => {
    if (!canvasRef.current) {
      return;
    }

    const link = document.createElement("a");
    link.download = "draw-together.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
    link.remove();
  };

  return (
    <Button
      onClick={saveCanvas}
      variant="secondary"
      size="sm"
      className="w-full cursor-pointer"
    >
      <Download className="mr-1.5 h-3.5 w-3.5" />
      Save Canvas
    </Button>
  );
};

export default SaveCanvasButton;
