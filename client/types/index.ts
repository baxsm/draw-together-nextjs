type UserRole = "admin" | "member";

interface UserType {
  id: string;
  username: string;
  role?: UserRole;
}

interface RoomJoinedType {
  user: UserType;
  roomId: string;
  members: UserType[];
}

interface NotificationType {
  title: string;
  message: string;
}

type AppTouchEvent = TouchEvent;

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
  userId?: string;
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
