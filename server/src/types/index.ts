type JoinRoomType = {
  roomId: string;
  username: string;
  password?: string;
};

type UserRole = "admin" | "member";

type User = {
  id: string;
  username: string;
  roomId: string;
  role: UserRole;
};

type ToolType =
  | "pen"
  | "eraser"
  | "rectangle"
  | "circle"
  | "line"
  | "text"
  | "laser";

interface Point {
  x: number;
  y: number;
}

interface DrawProps {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | undefined;
}

interface DrawOptions extends DrawProps {
  tool?: ToolType;
  strokeColor: string;
  strokeWidth: number[];
  dashGap: number[];
  startPoint?: Point;
  endPoint?: Point;
  text?: string;
  fontSize?: number;
}

interface MessageType {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  username: string;
}

interface SystemMessageType {
  id: string;
  type: "system";
  content: string;
  createdAt: string;
}

type ChatMessageType = MessageType | SystemMessageType;

interface CursorData {
  userId: string;
  username: string;
  x: number;
  y: number;
}

type PresenceStatus = "active" | "drawing" | "idle";
