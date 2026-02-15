import type { RefObject } from "react";
import { create } from "zustand";

interface CanvasState {
  tool: ToolType;
  strokeColor: string;
  strokeWidth: number[];
  dashGap: number[];
  fontSize: number[];
  isLocked: boolean;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  setTool: (tool: ToolType) => void;
  setStrokeColor: (strokeColor: string) => void;
  setStrokeWidth: (strokeWidth: number[]) => void;
  setDashGap: (dashGap: number[]) => void;
  setFontSize: (fontSize: number[]) => void;
  setIsLocked: (locked: boolean) => void;
  setCanvasRef: (eventRef: RefObject<HTMLCanvasElement | null>) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  tool: "pen",
  strokeColor: "#000",
  strokeWidth: [3],
  dashGap: [0],
  fontSize: [16],
  isLocked: false,
  canvasRef: { current: null },
  setTool: (tool) => set({ tool }),
  setCanvasRef: (canvasRef) => set({ canvasRef }),
  setStrokeColor: (strokeColor) => set({ strokeColor }),
  setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
  setDashGap: (dashGap) => set({ dashGap }),
  setFontSize: (fontSize) => set({ fontSize }),
  setIsLocked: (isLocked) => set({ isLocked }),
}));
