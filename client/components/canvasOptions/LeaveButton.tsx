import { DoorOpen, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Button } from "../ui/button";
import { socket } from "@/lib/socket";
import { useChatStore } from "@/stores/chatStore";

const LeaveButton: FC = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { setMessages } = useChatStore();

  const handleLeave = () => {
    setIsLoading(true);
    socket.emit("leave-room");
    setMessages([]);
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
