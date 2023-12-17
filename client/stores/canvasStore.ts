import { RefObject } from "react";
import { create } from "zustand";

interface CanvasState {
  strokeColor: string;
  strokeWidth: number[];
  dashGap: number[];
  canvasRef: RefObject<HTMLCanvasElement>;
  setStrokeColor: (strokeColor: string) => void;
  setStrokeWidth: (strokeWidth: number[]) => void;
  setDashGap: (dashGap: number[]) => void;
  setCanvasRef: (eventRef: RefObject<HTMLCanvasElement>) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  strokeColor: "#000",
  strokeWidth: [3],
  dashGap: [0],
  canvasRef: { current: null },
  setCanvasRef: (canvasRef) => set({ canvasRef }),
  setStrokeColor: (strokeColor) => set({ strokeColor }),
  setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
  setDashGap: (dashGap) => set({ dashGap }),
}));
