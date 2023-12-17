interface UserType {
  id: string;
  username: string;
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
  strokeColor: string;
  strokeWidth: number[];
  dashGap: number[];
}

interface MessageType {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
}
