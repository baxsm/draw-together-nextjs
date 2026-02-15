"use client";

import { type FC, memo } from "react";
import { getCursorColor } from "@/lib/cursorColors";
import { useCursorsStore } from "@/stores/cursorStore";

const CursorOverlay: FC = () => {
  const cursors = useCursorsStore((state) => state.cursors);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from(cursors.entries()).map(([userId, cursor]) => (
        <CursorIndicator key={userId} userId={userId} cursor={cursor} />
      ))}
    </div>
  );
};

interface CursorIndicatorProps {
  userId: string;
  cursor: CursorData;
}

const CursorIndicator: FC<CursorIndicatorProps> = memo(({ userId, cursor }) => {
  const color = getCursorColor(userId);

  return (
    <div
      className="absolute transition-transform duration-75 ease-out"
      style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
    >
      <svg
        width="16"
        height="20"
        viewBox="0 0 16 20"
        fill="none"
        className="-ml-0.5 -mt-0.5"
      >
        <path
          d="M0.928 0.640L15.028 10.580C15.362 10.804 15.188 11.340 14.780 11.340H8.408L5.588 19.040C5.468 19.380 4.988 19.380 4.868 19.040L0.308 1.200C0.218 0.832 0.628 0.440 0.928 0.640Z"
          fill={color}
          stroke="white"
          strokeWidth="1"
        />
      </svg>
      <span
        className="absolute left-3.5 top-4 whitespace-nowrap rounded-sm px-1.5 py-0.5 text-white text-xs shadow-sm"
        style={{ backgroundColor: color }}
      >
        {cursor.username}
      </span>
    </div>
  );
});

CursorIndicator.displayName = "CursorIndicator";

export default CursorOverlay;
