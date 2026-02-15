import { notFound } from "next/navigation";
import DrawingCanvas from "@/components/DrawingCanvas";
import { isValidUUID } from "@/lib/validations/joinRoom";

interface pageProps {
  params: Promise<{
    roomId: string;
  }>;
}

const page = async ({ params }: pageProps) => {
  const { roomId } = await params;

  if (!roomId || !isValidUUID(roomId)) {
    notFound();
  }

  return <DrawingCanvas roomId={roomId} />;
};

export default page;
