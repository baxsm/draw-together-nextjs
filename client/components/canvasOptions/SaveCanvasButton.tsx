import { useCanvasStore } from "@/stores/canvasStore";
import { FC } from "react";
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

  return <Button onClick={saveCanvas}>Save Canvas</Button>;
};

export default SaveCanvasButton;
