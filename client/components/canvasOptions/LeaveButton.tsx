import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FC, useState } from "react";
import { socket } from "@/lib/socket";
import { useCanvasStore } from "@/stores/canvasStore";
import { useChatStore } from "@/stores/chatStore";
import { useMembersStore } from "@/stores/membersStore";
import { useUserStore } from "@/stores/userStore";
import { Button } from "../ui/button";

const LeaveButton: FC = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { setMessages } = useChatStore();
  const { setMembers } = useMembersStore();
  const { setUser } = useUserStore();
  const {
    setDashGap,
    setStrokeColor,
    setStrokeWidth,
    setTool,
    setFontSize,
    setIsLocked,
  } = useCanvasStore();

  const handleLeave = () => {
    setIsLoading(true);

    socket.emit("leave-room");

    setUser(null);
    setMembers([]);
    setMessages([]);
    setStrokeColor("#000");
    setStrokeWidth([3]);
    setDashGap([0]);
    setTool("pen");
    setFontSize([16]);
    setIsLocked(false);

    router.replace("/");
  };

  return (
    <Button
      disabled={isLoading}
      variant="destructive"
      size="sm"
      onClick={handleLeave}
      className="cursor-pointer"
    >
      {isLoading ? (
        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
      ) : (
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
      )}
      Leave
    </Button>
  );
};

export default LeaveButton;
