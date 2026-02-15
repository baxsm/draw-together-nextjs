import type { FC, ReactNode } from "react";
import CanvasOptions from "@/components/canvasOptions";
import ChatBox from "@/components/chat";

interface layoutProps {
  children: ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      <main className="h-full w-full">{children}</main>
      <CanvasOptions />
      <ChatBox />
    </div>
  );
};

export default layout;
