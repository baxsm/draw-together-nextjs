import type { Server, Socket } from "socket.io";
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
  password: z.string().max(50).optional(),
});

let users: User[] = [];

const undoPoints: Record<string, string[]> = {};

const roomSettings: Record<string, { canvasLocked: boolean }> = {};

const roomPasswords: Record<string, string> = {};

export const setRoomPassword = (roomId: string, password: string) => {
  roomPasswords[roomId] = password;
};

export const getRoomPassword = (roomId: string) => {
  return roomPasswords[roomId];
};

const clearRoomPassword = (roomId: string) => {
  delete roomPasswords[roomId];
};

export const getUser = (userId: string) => {
  return users.find((user) => user.id === userId);
};

const addUser = (user: User) => {
  users.push(user);
};

const removeUser = (userId: string) => {
  users = users.filter((user) => user.id !== userId);
};

export const getRoomMembers = (roomId: string) => {
  return users
    .filter((user) => user.roomId === roomId)
    .map(({ id, username, role }) => ({ id, username, role }));
};

export const isAdmin = (userId: string): boolean => {
  const user = getUser(userId);
  return user?.role === "admin";
};

export const getRoomSettings = (roomId: string) => {
  if (!roomSettings[roomId]) {
    roomSettings[roomId] = { canvasLocked: false };
  }
  return roomSettings[roomId];
};

export const validateJoinRoomData = (
  socket: Socket,
  joinRoomData: JoinRoomType,
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

  const existingMembers = getRoomMembers(roomId);
  const role: UserRole = existingMembers.length === 0 ? "admin" : "member";

  const user = { id: socket.id, username };

  addUser({ ...user, roomId, role });

  const members = getRoomMembers(roomId);

  socket.emit("room-joined", { user: { ...user, role }, roomId, members });
  socket.to(roomId).emit("update-members", members);
  socket.to(roomId).emit("send-notification", {
    title: "New member joined",
    message: `${username} joined the room!`,
  });

  const systemMessage: SystemMessageType = {
    id: crypto.randomUUID(),
    type: "system",
    content: `${username} joined the room`,
    createdAt: new Date().toISOString(),
  };
  socket.to(roomId).emit("system-message-from-server", systemMessage);
};

export const leaveRoom = (io: Server, socket: Socket) => {
  const user = getUser(socket.id);
  if (!user) {
    return;
  }

  const { username, roomId, role } = user;

  removeUser(socket.id);

  const members = getRoomMembers(roomId);

  if (members.length === 0) {
    delete roomSettings[roomId];
    delete undoPoints[roomId];
    clearRoomPassword(roomId);
  }

  if (role === "admin" && members.length > 0) {
    const newAdmin = users.find(
      (u) => u.id === members[0].id && u.roomId === roomId,
    );
    if (newAdmin) {
      newAdmin.role = "admin";
      const updatedMembers = getRoomMembers(roomId);
      io.to(roomId).emit("update-members", updatedMembers);
      io.to(newAdmin.id).emit("role-changed", { role: "admin" });

      const promotionMsg: SystemMessageType = {
        id: crypto.randomUUID(),
        type: "system",
        content: `${newAdmin.username} is now the admin`,
        createdAt: new Date().toISOString(),
      };
      io.to(roomId).emit("system-message-from-server", promotionMsg);
    }
  } else {
    socket.to(roomId).emit("update-members", members);
  }

  socket.to(roomId).emit("send-notification", {
    title: "Member departure",
    message: `${username} left your room`,
  });

  const systemMessage: SystemMessageType = {
    id: crypto.randomUUID(),
    type: "system",
    content: `${username} left the room`,
    createdAt: new Date().toISOString(),
  };
  socket.to(roomId).emit("system-message-from-server", systemMessage);

  socket.to(roomId).emit("cursor-leave", socket.id);
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

  socket.to(adminMember.id).emit("get-canvas-state");
  socket.to(adminMember.id).emit("get-chat-state");
};

export const sendCanvasState = (
  socket: Socket,
  roomId: string,
  canvasState: string,
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

export const sendChatState = (
  socket: Socket,
  roomId: string,
  messages: ChatMessageType[],
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
  message: MessageType,
) => {
  socket.to(roomId).emit("chat-message-from-server", message);
};

export const _resetForTesting = () => {
  users = [];
  for (const key of Object.keys(undoPoints)) delete undoPoints[key];
  for (const key of Object.keys(roomSettings)) delete roomSettings[key];
  for (const key of Object.keys(roomPasswords)) delete roomPasswords[key];
};
