"use client";

import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { useMemo } from "react";
import CreateRoomForm from "@/components/CreateRoomForm";
import JoinRoomForm from "@/components/JoinRoomForm";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const roomId = useMemo(() => crypto.randomUUID(), []);

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center gap-2 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Pencil className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-sm tracking-tight">
          Draw Together
        </span>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-8 text-center"
        >
          <h1 className="mb-3 font-bold text-3xl tracking-tight md:text-4xl lg:text-5xl">
            Draw Together
          </h1>
          <p className="mx-auto max-w-md text-muted-foreground md:text-lg">
            A collaborative drawing platform for sharing moments of creativity
            and fun.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="border-border/60 backdrop-blur-sm">
            <CardContent className="flex flex-col gap-4 p-6">
              <CreateRoomForm roomId={roomId} />

              <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  or
                </p>
                <Separator className="flex-1" />
              </div>

              <JoinRoomForm />
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center">
        <p className="text-muted-foreground text-xs">
          Built with Next.js & Socket.io
        </p>
      </footer>
    </div>
  );
}
