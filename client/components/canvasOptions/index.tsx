"use client";

import { FC, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ColorPicker from "./ColorPicker";
import StrokeSliders from "./StrokeSliders";
import { Separator } from "../ui/separator";
import { socket } from "@/lib/socket";
import { ChevronsLeft, Cog, DoorOpen, X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import ThemeToggleButton from "../ThemeToggleButton";
import LeaveButton from "./LeaveButton";
import ClearButton from "./ClearButton";
import UndoButton from "./UndoButton";
import SaveCanvasButton from "./SaveCanvasButton";

const CanvasOptions: FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    socket.on("client-loaded", () => {
      setIsLoading(false);
    });

    return () => {
      socket.off("client-loaded");
    };
  });

  if (isLoading) {
    return <></>;
  }

  return (
    <div className="absolute left-4 top-4 z-20 h-fit">
      <div className="flex items-center gap-4 mb-4">
        <LeaveButton />
        <Button
          onClick={() => setIsVisible((prev) => !prev)}
          className={cn("bg-background hover:bg-background/90")}
          size="icon"
          variant="outline"
        >
          <Cog className="w-5 h-5 text-foreground" />
        </Button>
        <ThemeToggleButton />
      </div>
      <Card
        className={cn("transition-all relative duration-300 w-full h-full", {
          "scale-0 h-0": !isVisible,
        })}
      >
        <Button
          onClick={() => setIsVisible((prev) => !prev)}
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
        >
          <X className="w-5 h-5" />
        </Button>
        <CardHeader>
          <CardTitle className="text-xl w-fit">Customize</CardTitle>
        </CardHeader>
        <CardContent className="max-w-xs">
          <div className="flex flex-col gap-4">
            <ColorPicker />
            <Separator />
            <StrokeSliders />
            <Separator />
            <div className="flex items-center gap-2">
              <ClearButton />
              <UndoButton />
            </div>
            <Separator />
            <SaveCanvasButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CanvasOptions;
