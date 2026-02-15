import { Check, Link } from "lucide-react";
import { useParams } from "next/navigation";
import type { FC } from "react";
import { useCopyToClipboard } from "@/lib/hooks/useCopyToClipboard";
import { Button } from "../ui/button";

const InviteLinkButton: FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 2000 });

  const handleCopy = () => {
    const inviteUrl = `${window.location.origin}/join/${roomId}`;
    copyToClipboard(inviteUrl);
  };

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      size="sm"
      className="w-full cursor-pointer"
    >
      {isCopied ? (
        <Check className="mr-1.5 h-3.5 w-3.5" />
      ) : (
        <Link className="mr-1.5 h-3.5 w-3.5" />
      )}
      {isCopied ? "Copied!" : "Copy Invite Link"}
    </Button>
  );
};

export default InviteLinkButton;
