import { Server } from "socket.io";
import {
  addUndoPoint,
  deleteLastUndoPoint,
  getLastUndoPoint,
  getRoomMembers,
  getRoomPassword,
  getRoomSettings,
  getUser,
  isAdmin,
  joinRoom,
  leaveRoom,
  sendCanvasState,
  sendChatState,
  sendMessage,
  setClientReady,
  setRoomPassword,
  validateJoinRoomData,
} from "./helpers";

const PORT = Number(process.env.PORT) || 3001;

const io = new Server(PORT, {
  cors: {
    origin: "*",
  },
});

const isRoomCreated = (roomId: string) => {
  const rooms = [...io.sockets.adapter.rooms];
  return rooms?.some((room) => room[0] === roomId);
};

const isCanvasActionAllowed = (socketId: string, roomId: string) => {
  const settings = getRoomSettings(roomId);
  return !settings.canvasLocked || isAdmin(socketId);
};

io.on("connection", (socket) => {
  socket.on("create-room", (joinRoomData: JoinRoomType) => {
    const validateData = validateJoinRoomData(socket, joinRoomData);

    if (!validateData) {
      return;
    }

    const { roomId, username } = validateData;

    if (joinRoomData.password && joinRoomData.password.length > 0) {
      setRoomPassword(roomId, joinRoomData.password);
    }

    joinRoom(socket, roomId, username);
  });

  socket.on("join-room", (joinRoomData: JoinRoomType) => {
    const validateData = validateJoinRoomData(socket, joinRoomData);

    if (!validateData) {
      return;
    }

    const { roomId, username } = validateData;

    if (!isRoomCreated(roomId)) {
      socket.emit("room-not-found", {
        message:
          "Oops! The room id you entered doesn't exist or haven't been created!",
      });
      return;
    }

    const storedPassword = getRoomPassword(roomId);
    if (storedPassword) {
      if (!joinRoomData.password) {
        socket.emit("password-required", { roomId });
        return;
      }
      if (joinRoomData.password !== storedPassword) {
        socket.emit("invalid-password", {
          message: "Incorrect room password",
        });
        return;
      }
    }

    joinRoom(socket, roomId, username);
  });

  socket.on("client-ready", (roomId: string) => {
    setClientReady(socket, roomId);
  });

  socket.on(
    "send-chat-state",
    ({ messages, roomId }: { messages: ChatMessageType[]; roomId: string }) => {
      sendChatState(socket, roomId, messages);
    },
  );

  socket.on(
    "send-chat-message",
    ({ message, roomId }: { message: MessageType; roomId: string }) => {
      sendMessage(socket, roomId, message);
    },
  );

  socket.on("send-canvas-state", ({ canvasState, roomId }) => {
    sendCanvasState(socket, roomId, canvasState);
  });

  socket.on(
    "draw",
    ({ drawOptions, roomId }: { drawOptions: DrawOptions; roomId: string }) => {
      if (!isCanvasActionAllowed(socket.id, roomId)) return;
      socket
        .to(roomId)
        .emit("update-canvas-state", { ...drawOptions, userId: socket.id });
    },
  );

  socket.on(
    "cursor-move",
    ({ x, y, roomId }: { x: number; y: number; roomId: string }) => {
      const user = getUser(socket.id);
      if (!user) return;
      socket.to(roomId).emit("cursor-update", {
        userId: socket.id,
        username: user.username,
        x,
        y,
      });
    },
  );

  socket.on("clear-canvas", (roomId: string) => {
    if (!isCanvasActionAllowed(socket.id, roomId)) return;
    socket.to(roomId).emit("clear-canvas");
  });

  socket.on(
    "undo",
    ({ canvasState, roomId }: { canvasState: string; roomId: string }) => {
      if (!isCanvasActionAllowed(socket.id, roomId)) return;
      socket.to(roomId).emit("undo-canvas", canvasState);
    },
  );

  socket.on("get-last-undo-point", (roomId: string) => {
    const lastUndoPoint = getLastUndoPoint(roomId);
    socket.emit("last-undo-point-from-server", lastUndoPoint);
  });

  socket.on(
    "add-undo-point",
    ({ roomId, undoPoint }: { roomId: string; undoPoint: string }) => {
      if (!isCanvasActionAllowed(socket.id, roomId)) return;
      addUndoPoint(roomId, undoPoint);
    },
  );

  socket.on("delete-last-undo-point", (roomId: string) => {
    deleteLastUndoPoint(roomId);
  });

  socket.on(
    "presence-update",
    ({ roomId, status }: { roomId: string; status: PresenceStatus }) => {
      const user = getUser(socket.id);
      if (!user) return;
      socket.to(roomId).emit("user-presence", {
        userId: socket.id,
        status,
      });
    },
  );

  socket.on(
    "typing",
    ({ roomId, isTyping }: { roomId: string; isTyping: boolean }) => {
      const user = getUser(socket.id);
      if (!user) return;
      socket.to(roomId).emit("user-typing", {
        userId: socket.id,
        username: user.username,
        isTyping,
      });
    },
  );

  socket.on(
    "kick-user",
    ({ userId, roomId }: { userId: string; roomId: string }) => {
      if (!isAdmin(socket.id)) return;
      const target = getUser(userId);
      if (!target || target.roomId !== roomId) return;

      io.to(userId).emit("kicked", {
        message: "You have been kicked from the room",
      });
      const targetSocket = io.sockets.sockets.get(userId);
      if (targetSocket) {
        leaveRoom(io, targetSocket);
      }
    },
  );

  socket.on("toggle-canvas-lock", ({ roomId }: { roomId: string }) => {
    if (!isAdmin(socket.id)) return;
    const settings = getRoomSettings(roomId);
    settings.canvasLocked = !settings.canvasLocked;
    io.to(roomId).emit("canvas-lock-changed", {
      locked: settings.canvasLocked,
    });

    const systemMessage: SystemMessageType = {
      id: crypto.randomUUID(),
      type: "system",
      content: settings.canvasLocked
        ? "Canvas has been locked by admin"
        : "Canvas has been unlocked",
      createdAt: new Date().toISOString(),
    };
    io.to(roomId).emit("system-message-from-server", systemMessage);
  });

  socket.on(
    "promote-user",
    ({ userId, roomId }: { userId: string; roomId: string }) => {
      if (!isAdmin(socket.id)) return;
      const target = getUser(userId);
      if (!target || target.roomId !== roomId) return;

      target.role = "admin";
      const currentUser = getUser(socket.id);
      if (currentUser) currentUser.role = "member";

      io.to(userId).emit("role-changed", { role: "admin" });
      socket.emit("role-changed", { role: "member" });
      io.to(roomId).emit("update-members", getRoomMembers(roomId));
    },
  );

  socket.on("leave-room", () => {
    leaveRoom(io, socket);
  });

  socket.on("disconnect", () => {
    socket.emit("disconnected");
    leaveRoom(io, socket);
  });
});
