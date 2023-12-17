type JoinRoomType = {
  roomId: string;
  username: string;
};

type User = {
  id: string;
  username: string;
  roomId: string;
};

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
