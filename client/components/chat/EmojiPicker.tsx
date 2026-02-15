"use client";

import { Smile } from "lucide-react";
import { type FC, useState } from "react";
import { type EmojiCategory, emojiCategories } from "@/lib/emoji";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  disabled?: boolean;
}

const EmojiPicker: FC<EmojiPickerProps> = ({ onSelect, disabled }) => {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          type="button"
          size="icon"
          variant="ghost"
          className="h-7 w-7 cursor-pointer"
        >
          <Smile className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="w-64 p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex gap-0.5 overflow-x-auto border-b p-1.5">
          {emojiCategories.map((category, i) => (
            <button
              key={category.name}
              type="button"
              onClick={() => setActiveCategory(i)}
              className={cn(
                "shrink-0 rounded px-1.5 py-0.5 text-[10px] transition-colors",
                activeCategory === i
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="h-40 overflow-y-auto p-2">
          <EmojiGrid
            category={emojiCategories[activeCategory]}
            onSelect={handleSelect}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

const EmojiGrid: FC<{
  category: EmojiCategory;
  onSelect: (emoji: string) => void;
}> = ({ category, onSelect }) => (
  <div className="grid grid-cols-8 gap-0.5">
    {category.emojis.map((emoji) => (
      <button
        key={emoji}
        type="button"
        onClick={() => onSelect(emoji)}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-base transition-colors hover:bg-muted"
      >
        {emoji}
      </button>
    ))}
  </div>
);

export default EmojiPicker;
