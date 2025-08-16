import { io, Socket } from 'socket.io-client';
import { Message, User, Room, TypingUser } from '../types/chat';

class SocketService {
  private socket: Socket | null = null;
  private connected = false;

  connect(token: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io('http://localhost:3001', {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('🔗 Connected to chat server');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from chat server');
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  isConnected(): boolean {
    return this.connected && this.socket?.connected === true;
  }

  // User events
  joinAsUser(user: User) {
    this.socket?.emit('user:join', user);
  }

  onUserOnline(callback: (user: User) => void) {
    this.socket?.on('user:online', callback);
  }

  onUserOffline(callback: (user: User) => void) {
    this.socket?.on('user:offline', callback);
  }

  onUsersOnline(callback: (users: User[]) => void) {
    this.socket?.on('users:online', callback);
  }

  // Room events
  joinRoom(roomId: string) {
    this.socket?.emit('room:join', roomId);
  }

  leaveRoom(roomId: string) {
    this.socket?.emit('room:leave', roomId);
  }

  onRoomsList(callback: (rooms: Room[]) => void) {
    this.socket?.on('rooms:list', callback);
  }

  // Message events
  sendMessage(content: string, roomId: string, type: 'text' | 'image' | 'file' = 'text') {
    this.socket?.emit('message:send', {
      content,
      roomId,
      type
    });
  }

  onNewMessage(callback: (message: Message) => void) {
    this.socket?.on('message:new', callback);
  }

  onMessagesHistory(callback: (data: { roomId: string; messages: Message[] }) => void) {
    this.socket?.on('messages:history', callback);
  }

  // Typing events
  startTyping(roomId: string) {
    this.socket?.emit('typing:start', { roomId });
  }

  stopTyping(roomId: string) {
    this.socket?.emit('typing:stop', { roomId });
  }

  onTypingStart(callback: (data: TypingUser) => void) {
    this.socket?.on('typing:start', callback);
  }

  onTypingStop(callback: (data: TypingUser) => void) {
    this.socket?.on('typing:stop', callback);
  }

  // Cleanup
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

export const socketService = new SocketService();