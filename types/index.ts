interface UserType {
  id: string;
  username: string;
}

interface RoomJoinedType {
  user: User;
  roomId: string;
  members: User[];
}

interface NotificationType {
  title: string;
  message: string;
}
