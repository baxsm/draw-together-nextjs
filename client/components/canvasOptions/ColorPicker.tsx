"use client";

import type { FC } from "react";
import {
  type IColor,
  ColorPicker as ReactColorPicker,
  useColor,
} from "react-color-palette";
import { useCanvasStore } from "@/stores/canvasStore";
import "react-color-palette/css";

type ColorPickerProps = {};

const ColorPicker: FC<ColorPickerProps> = ({}) => {
  const [color, setColor] = useColor("#000");
  const setStrokeColor = useCanvasStore((state) => state.setStrokeColor);

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
