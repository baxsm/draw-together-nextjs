"use client";

import { type FC, useEffect, useRef, useState } from "react";

interface TextInputProps {
  position: Point;
  onSubmit: (text: string) => void;
  onCancel: () => void;
  strokeColor: string;
  fontSize: number;
}

const TextInput: FC<TextInputProps> = ({
  position,
  onSubmit,
  onCancel,
  strokeColor,
  fontSize,
}) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    if (value.trim()) {
      onSubmit(value);
    }
    onCancel();
  };

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSubmit();
        if (e.key === "Escape") onCancel();
      }}
      onBlur={handleSubmit}
      className="absolute z-30 border-none bg-transparent outline-none"
      style={{
        left: position.x,
        top: position.y,
        color: strokeColor,
        fontSize: `${fontSize}px`,
        fontFamily: "sans-serif",
      }}
    />
  );
};

export default TextInput;
