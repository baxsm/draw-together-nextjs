import { Info } from "lucide-react";
import type { FC } from "react";
import { formatRelativeTime } from "@/lib/utils";

interface SystemMessageProps {
  message: SystemMessageType;
}

const SystemMessage: FC<SystemMessageProps> = ({ message }) => {
  return (
    <div className="my-2 flex items-center justify-center gap-1.5">
      <Info className="h-3 w-3 shrink-0 text-muted-foreground/60" />
      <span className="text-[10px] text-muted-foreground/60">
        {message.content}
      </span>
      <span className="shrink-0 text-[9px] text-muted-foreground/40">
        {formatRelativeTime(message.createdAt)}
      </span>
    </div>
  );
};

export default SystemMessage;
