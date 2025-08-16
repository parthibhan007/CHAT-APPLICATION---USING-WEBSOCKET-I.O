export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  roomId: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
}

export interface Room {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface TypingUser {
  userId: string;
  userName: string;
  roomId: string;
}