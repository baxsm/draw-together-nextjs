import { useCopyToClipboard } from "@/lib/hooks/useCopyToClipboard";
import { FC } from "react";
import { Button } from "./ui/button";
import { Check, Copy } from "lucide-react";

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
