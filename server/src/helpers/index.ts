import { type Socket } from "socket.io";
import * as z from "zod";

const isValidUUID = (value: string) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

const joinRoomSchema = z.object({
  username: z
    .string()
    .min(2, "Username is too short")
    .max(20, "Username is too long"),
  roomId: z.string().refine((value) => isValidUUID(value), {
    message: "Invalid roomId",
  }),
});

let users: User[] = [];

let undoPoints: Record<string, string[]> = {};

const getUser = (userId: string) => {
  return users.find((user) => user.id === userId);
};

const addUser = (user: User) => {
  users.push(user);
};

const removeUser = (userId: string) => {
  users = users.filter((user) => user.id !== userId);
};

const getRoomMembers = (roomId: string) => {
  return users
    .filter((user) => user.roomId === roomId)
    .map(({ id, username }) => ({ id, username }));
};

export const validateJoinRoomData = (
  socket: Socket,
  joinRoomData: JoinRoomType
) => {
  try {
    return joinRoomSchema.parse(joinRoomData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      socket.emit("invalid-data", {
        message: "Unable to process this request",
      });
    }
  }
};

export const joinRoom = (socket: Socket, roomId: string, username: string) => {
  socket.join(roomId);

  const user = {
    id: socket.id,
    username,
  };

  addUser({ ...user, roomId });

  const members = getRoomMembers(roomId);

  socket.emit("room-joined", { user, roomId, members });
  socket.to(roomId).emit("update-members", members);
  socket.to(roomId).emit("send-notification", {
    title: "New member joined",
    message: `${username} joined the room!`,
  });
};

export const leaveRoom = (socket: Socket) => {
  const user = getUser(socket.id);
  if (!user) {
    return;
  }

  const { username, roomId } = user;

  removeUser(socket.id);

  const members = getRoomMembers(roomId);

  socket.to(roomId).emit("update-members", members);
  socket.to(roomId).emit("send-notification", {
    title: "Member departure",
    message: `${username} left your room`,
  });
  socket.leave(roomId);
};

export const setClientReady = (socket: Socket, roomId: string) => {
  const members = getRoomMembers(roomId);

  if (members.length === 1) {
    return socket.emit("client-loaded");
  }

  const adminMember = members[0];

  if (!adminMember) {
    return;
  }

  // get canvas state of the admin / first member
  socket.to(adminMember.id).emit("get-canvas-state");
  // get chat state of the admin / first member
  socket.to(adminMember.id).emit("get-chat-state");
};

// canvas
export const sendCanvasState = (
  socket: Socket,
  roomId: string,
  canvasState: string
) => {
  const members = getRoomMembers(roomId);

  const lastMember = members[members.length - 1];

  if (!lastMember) {
    return;
  }

  socket.to(lastMember.id).emit("canvas-state-from-server", canvasState);
};

export const addUndoPoint = (roomId: string, undoPoint: string) => {
  const room = undoPoints[roomId];
  if (room) {
    return room.push(undoPoint);
  }
  undoPoints[roomId] = [undoPoint];
};

export const getLastUndoPoint = (roomId: string) => {
  const roomUndoPoints = undoPoints[roomId];
  if (!roomUndoPoints) return;
  return roomUndoPoints[roomUndoPoints.length - 1];
};

export const deleteLastUndoPoint = (roomId: string) => {
  const room = undoPoints[roomId];
  if (!room) return;
  undoPoints[roomId].pop();
};

// messages
export const sendChatState = (
  socket: Socket,
  roomId: string,
  messages: MessageType[]
) => {
  const members = getRoomMembers(roomId);

  const lastMember = members[members.length - 1];

  if (!lastMember) {
    return;
  }

  socket.to(lastMember.id).emit("chat-state-from-server", messages);
};

export const sendMessage = (
  socket: Socket,
  roomId: string,
  message: MessageType
) => {
  const members = getRoomMembers(roomId);

  const toMember = [...members].find((e) => e.id !== message.userId);

  if (!toMember) {
    return;
  }

  socket.to(toMember.id).emit("chat-message-from-server", message);
};
