import CanvasOptions from "@/components/canvasOptions";
import Messages from "@/components/messages";
import { FC, ReactNode } from "react";

interface layoutProps {
  children: ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen relative">
      <main className="w-full h-full">{children}</main>
      <CanvasOptions />
      <Messages />
    </div>
  );
};

export default layout;
