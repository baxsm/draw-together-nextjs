"use client";

import { useCanvasStore } from "@/stores/canvasStore";
import { FC } from "react";
import {
  IColor,
  ColorPicker as ReactColorPicker,
  useColor,
} from "react-color-palette";
import "react-color-palette/css";

interface ColorPickerProps {}

const ColorPicker: FC<ColorPickerProps> = ({}) => {
  const [color, setColor] = useColor("#000");
  const [_, setStrokeColor] = useCanvasStore((state) => [
    state.strokeColor,
    state.setStrokeColor,
  ]);

  const handleChange = (color: IColor) => {
    setColor(color);
    setStrokeColor(color.hex);
  };

  return (
    <div className="w-[200px]">
      <ReactColorPicker color={color} onChange={handleChange} hideInput />
    </div>
  );
};

export default ColorPicker;
