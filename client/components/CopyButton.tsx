import { Check, Copy } from "lucide-react";
import type { FC } from "react";
import { useCopyToClipboard } from "@/lib/hooks/useCopyToClipboard";
import { Button } from "./ui/button";

interface CopyButtonProps {
  value: string;
}

const CopyButton: FC<CopyButtonProps> = ({ value }) => {
  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 2000 });

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="p-0 hover:bg-background"
      onClick={() => copyToClipboard(value)}
    >
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      <span className="sr-only">Copy</span>
    </Button>
  );
};

export default CopyButton;
