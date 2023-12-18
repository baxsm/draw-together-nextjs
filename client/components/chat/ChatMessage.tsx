import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/userStore";
import { FC } from "react";

interface ChatMessageProps {
  message: MessageType;
}

const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
  const { user } = useUserStore();

  return (
    <div
      className={cn("flex", {
        "justify-end": user?.id === message.userId,
        "justify-start": user?.id !== message.userId,
      })}
    >
      <div
        className={cn("py-4 px-4 flex bg-accent rounded-lg w-fit", {
          "rounded-br-none": user?.id === message.userId,
          "rounded-bl-none": user?.id !== message.userId,
        })}
      >
        <h5 className="text-xs text-foreground max-w-[180px] break-words">
          {message.content}
        </h5>
      </div>
    </div>
  );
};

export default ChatMessage;
