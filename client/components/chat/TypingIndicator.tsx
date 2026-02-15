"use client";

import { type FC, memo } from "react";
import { useChatStore } from "@/stores/chatStore";

const TypingIndicator: FC = memo(() => {
  const typingUsers = useChatStore((state) => state.typingUsers);

  if (typingUsers.size === 0) return null;

  const names = Array.from(typingUsers.values());
  const text =
    names.length === 1
      ? `${names[0]} is typing`
      : names.length === 2
        ? `${names[0]} and ${names[1]} are typing`
        : `${names[0]} and ${names.length - 1} others are typing`;

  return (
    <div className="flex items-center gap-1.5 px-3 py-1">
      <div className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
      <span className="text-[10px] text-muted-foreground">{text}</span>
    </div>
  );
});

TypingIndicator.displayName = "TypingIndicator";

export default TypingIndicator;
