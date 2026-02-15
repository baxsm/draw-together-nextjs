"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { type FC, useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { useCanvasStore } from "@/stores/canvasStore";
import { useUserStore } from "@/stores/userStore";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import AdminControls from "./AdminControls";
import ClearButton from "./ClearButton";
import InviteLinkButton from "./InviteLinkButton";
import ColorPicker from "./ColorPicker";
import LeaveButton from "./LeaveButton";
import SaveCanvasButton from "./SaveCanvasButton";
import StrokeSliders from "./StrokeSliders";
import ToolSelector from "./ToolSelector";
import UndoButton from "./UndoButton";

const CanvasOptions: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const isLocked = useCanvasStore((state) => state.isLocked);
  const role = useUserStore((state) => state.role);
  const toolsDisabled = isLocked && role !== "admin";

  useEffect(() => {
    socket.on("client-loaded", () => {
      setIsLoading(false);
    });

    return () => {
      socket.off("client-loaded");
    };
  });

  if (isLoading) {
    return null;
  }

  return (
    <div className="absolute top-4 left-4 z-20 w-60 overflow-hidden rounded-xl border border-border/60 bg-background/80 shadow-lg backdrop-blur-xl">
      <div className="flex items-center justify-between px-3 py-2">
        <LeaveButton />
        <Button
          onClick={() => setIsExpanded((prev) => !prev)}
          size="icon"
          variant="ghost"
          className="h-7 w-7 cursor-pointer"
          aria-label="Toggle tools panel"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Separator />
            <div className="flex flex-col gap-4 p-4">
              <div className={toolsDisabled ? "pointer-events-none opacity-40" : ""}>
                <ToolSelector />
              </div>
              <Separator />
              <div className={toolsDisabled ? "pointer-events-none opacity-40" : ""}>
                <ColorPicker />
              </div>
              <Separator />
              <div className={toolsDisabled ? "pointer-events-none opacity-40" : ""}>
                <StrokeSliders />
              </div>
              <Separator />
              <div className={toolsDisabled ? "pointer-events-none opacity-40" : ""}>
                <div className="flex items-center gap-2">
                  <ClearButton />
                  <UndoButton />
                </div>
              </div>
              <Separator />
              <SaveCanvasButton />
              <InviteLinkButton />
              <AdminControls />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CanvasOptions;
