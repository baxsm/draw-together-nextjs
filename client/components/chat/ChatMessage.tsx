import type { FC } from "react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useUserStore } from "@/stores/userStore";

interface ChatMessageProps {
  message: MessageType;
  showSender: boolean;
}

const ChatMessage: FC<ChatMessageProps> = ({ message, showSender }) => {
  const { user } = useUserStore();
  const isOwn = user?.id === message.userId;

  return (
    <div
      className={cn("flex flex-col", {
        "items-end": isOwn,
        "items-start": !isOwn,
        "mt-2": showSender,
        "mt-0.5": !showSender,
      })}
    >
      {showSender && !isOwn && (
        <span className="mb-0.5 ml-1 text-[10px] text-muted-foreground">
          {message.username}
        </span>
      )}
      <div
        className={cn(
          "max-w-50 rounded-lg px-3 py-2",
          isOwn
            ? "rounded-br-none bg-primary text-primary-foreground"
            : "rounded-bl-none bg-muted text-foreground",
        )}
      >
        <p className="wrap-break-word text-xs leading-relaxed">
          {message.content}
        </p>
      </div>
      <span className="mt-0.5 px-1 text-[9px] text-muted-foreground/60">
        {formatRelativeTime(message.createdAt)}
      </span>
    </div>
  );
};

export default ChatMessage;
