import CreateRoomForm from "@/components/CreateRoomForm";
import JoinRoomButton from "@/components/JoinRoomButton";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="relative h-screen">
      {/* Toggle Theme | Home */}
      <div className="absolute left-8 bottom-8">
        <ThemeToggleButton />
      </div>

      {/* Create Room Form */}
      <div className="flex h-full w-full items-center justify-center">
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Draw Together</CardTitle>
            <CardDescription>
              Draw Together: A collaborative platform for sharing moments of
              creativity and fun!
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <CreateRoomForm />

            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <p className="text-xs text-muted-foreground">OR</p>
              <Separator className="flex-1" />
            </div>

            <JoinRoomButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
