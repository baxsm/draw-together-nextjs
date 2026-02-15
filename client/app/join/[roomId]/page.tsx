import { Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import JoinRoomFormWithId from "@/components/JoinRoomFormWithId";
import { Card, CardContent } from "@/components/ui/card";
import { isValidUUID } from "@/lib/validations/joinRoom";

interface PageProps {
  params: Promise<{
    roomId: string;
  }>;
}

const JoinPage = async ({ params }: PageProps) => {
  const { roomId } = await params;

  if (!roomId || !isValidUUID(roomId)) {
    notFound();
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="flex items-center gap-2 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Pencil className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-sm tracking-tight">
          Draw Together
        </span>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-16">
        <div className="mb-8 text-center">
          <h1 className="mb-3 font-bold text-3xl tracking-tight md:text-4xl">
            Join Room
          </h1>
          <p className="mx-auto max-w-md text-muted-foreground">
            You&apos;ve been invited to a drawing room. Enter your name to join.
          </p>
        </div>

        <div className="w-full max-w-md">
          <Card className="border-border/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <JoinRoomFormWithId roomId={roomId} />
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="px-6 py-4 text-center">
        <p className="text-muted-foreground text-xs">
          Built with Next.js & Socket.io
        </p>
      </footer>
    </div>
  );
};

export default JoinPage;
