import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import {
  addUndoPoint,
  deleteLastUndoPoint,
  getLastUndoPoint,
  joinRoom,
  leaveRoom,
  sendCanvasState,
  sendChatState,
  sendMessage,
  setClientReady,
  validateJoinRoomData,
} from "./helpers";

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server);

const isRoomCreated = (roomId: string) => {
  const rooms = [...io.sockets.adapter.rooms];
  return rooms?.some((room) => room[0] === roomId);
};

io.on("connection", (socket) => {
  socket.on("create-room", (joinRoomData: JoinRoomType) => {
    const validateData = validateJoinRoomData(socket, joinRoomData);

    if (!validateData) {
      return;
    }

    const { roomId, username } = validateData;

    joinRoom(socket, roomId, username);
  });

  socket.on("join-room", (joinRoomData: JoinRoomType) => {
    const validateData = validateJoinRoomData(socket, joinRoomData);

    if (!validateData) {
      return;
    }

    const { roomId, username } = validateData;

    if (isRoomCreated(roomId)) {
      return joinRoom(socket, roomId, username);
    }

    socket.emit("room-not-found", {
      message:
        "Oops! The room id you entered doesn't exist or haven't been created!",
    });
  });

  socket.on("client-ready", (roomId: string) => {
    setClientReady(socket, roomId);
  });

  // messages
  socket.on(
    "send-chat-state",
    ({ messages, roomId }: { messages: MessageType[]; roomId: string; }) => {
      sendChatState(socket, roomId, messages)
    }
  );

  socket.on(
    "send-chat-message",
    ({ message, roomId }: { message: MessageType; roomId: string }) => {
      sendMessage(socket, roomId, message);
    }
  );

  // canvas
  socket.on("send-canvas-state", ({ canvasState, roomId }) => {
    sendCanvasState(socket, roomId, canvasState);
  });

  socket.on(
    "draw",
    ({ drawOptions, roomId }: { drawOptions: DrawOptions; roomId: string }) => {
      socket.to(roomId).emit("update-canvas-state", drawOptions);
    }
  );

  socket.on("clear-canvas", (roomId: string) => {
    socket.to(roomId).emit("clear-canvas");
  });

  socket.on(
    "undo",
    ({ canvasState, roomId }: { canvasState: string; roomId: string }) => {
      socket.to(roomId).emit("undo-canvas", canvasState);
    }
  );

  socket.on("get-last-undo-point", (roomId: string) => {
    const lastUndoPoint = getLastUndoPoint(roomId);
    socket.emit("last-undo-point-from-server", lastUndoPoint);
  });

  socket.on(
    "add-undo-point",
    ({ roomId, undoPoint }: { roomId: string; undoPoint: string }) => {
      addUndoPoint(roomId, undoPoint);
    }
  );

  socket.on("delete-last-undo-point", (roomId: string) => {
    deleteLastUndoPoint(roomId);
  });

  socket.on("leave-room", () => {
    leaveRoom(socket);
  });

  socket.on("disconnect", () => {
    socket.emit("disconnected");
    leaveRoom(socket);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(
    `Frontend: http://localhost:3000 | Backend: http://localhost:${PORT}`
  );
});
