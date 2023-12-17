import DrawingCanvas from "@/components/DrawingCanvas";
import { isValidUUID } from "@/lib/validations/joinRoom";
import { notFound } from "next/navigation";
import { FC } from "react";

interface pageProps {
  params: {
    roomId: string;
  };
}

const page: FC<pageProps> = ({ params }) => {
  if (!params.roomId && !isValidUUID(params.roomId)) {
    notFound();
  }

  return <DrawingCanvas roomId={params.roomId} />;
};

export default page;
