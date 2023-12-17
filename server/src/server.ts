import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { joinRoom, leaveRoom, validateJoinRoomData } from "./helpers";

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
  console.log(`Server started on port: ${PORT}`);
});
