export interface Message {
  id: string;
  room: string;
  sender: string;
  text: string;
  createdAt: string;
}

export interface UserJionPayload {
  username: string;
  room: string;
}
