import { DoorOpen, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Button } from "../ui/button";
import { socket } from "@/lib/socket";
import { useChatStore } from "@/stores/chatStore";
import { useCanvasStore } from "@/stores/canvasStore";
import { useUserStore } from "@/stores/userStore";
import { useMembersStore } from "@/stores/membersStore";

const LeaveButton: FC = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { setMessages } = useChatStore();
  const { setMembers } = useMembersStore();
  const { setUser } = useUserStore();
  const { setDashGap, setStrokeColor, setStrokeWidth } = useCanvasStore();

  const handleLeave = () => {
    setIsLoading(true);

    socket.emit("leave-room");

    setUser(null);
    setMembers([]);
    setMessages([]);
    setStrokeColor("#000");
    setStrokeWidth([3]);
    setDashGap([0]);

    router.replace("/");
  };

  return (
    <Button disabled={isLoading} variant="destructive" onClick={handleLeave}>
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
      ) : (
        <DoorOpen className="w-4 h-4 mr-1.5" />
      )}
      Leave Room
    </Button>
  );
};

export default LeaveButton;
