import React, { createContext, useContext, useEffect, useState } from 'react';
import { Message, Room, User, TypingUser } from '../types/chat';
import { socketService } from '../services/socket';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface ChatContextType {
  rooms: Room[];
  currentRoom: Room | null;
  messages: Message[];
  onlineUsers: User[];
  typingUsers: TypingUser[];
  selectRoom: (room: Room) => void;
  sendMessage: (content: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  useEffect(() => {
    if (!user || !socketService.isConnected()) return;

    // Listen for rooms list
    socketService.onRoomsList((roomsList) => {
      setRooms(roomsList);
      // Auto-select first room if no room is selected
      if (!currentRoom && roomsList.length > 0) {
        setCurrentRoom(roomsList[0]);
        socketService.joinRoom(roomsList[0].id);
      }
    });

    // Listen for new messages
    socketService.onNewMessage((message) => {
      // Only add message if it's for the current room
      if (currentRoom && message.roomId === currentRoom.id) {
        setMessages(prev => [...prev, message]);
      }
      
      // Show notification if message is not from current user
      if (message.user.id !== user.id) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`${message.user.name} in ${rooms.find(r => r.id === message.roomId)?.name || 'Chat'}`, {
            body: message.content,
            icon: message.user.avatar
          });
        }
      }
    });

    // Listen for message history
    socketService.onMessagesHistory(({ roomId, messages: roomMessages }) => {
      if (currentRoom && roomId === currentRoom.id) {
        setMessages(roomMessages);
      }
    });

    // Listen for online users
    socketService.onUsersOnline(setOnlineUsers);

    // Listen for user online/offline events
    socketService.onUserOnline((newUser) => {
      setOnlineUsers(prev => {
        const exists = prev.some(u => u.id === newUser.id);
        return exists ? prev : [...prev, newUser];
      });
    });

    socketService.onUserOffline((offlineUser) => {
      setOnlineUsers(prev => prev.filter(u => u.id !== offlineUser.id));
    });

    // Listen for typing events
    socketService.onTypingStart((data) => {
      if (data.roomId === currentRoom?.id && data.userId !== user.id) {
        setTypingUsers(prev => {
          const exists = prev.some(t => t.userId === data.userId && t.roomId === data.roomId);
          return exists ? prev : [...prev, data];
        });
      }
    });

    socketService.onTypingStop((data) => {
      setTypingUsers(prev => prev.filter(t => !(t.userId === data.userId && t.roomId === data.roomId)));
    });

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      socketService.removeAllListeners();
    };
  }, [user, currentRoom, rooms]);

  const selectRoom = (room: Room) => {
    if (currentRoom) {
      socketService.leaveRoom(currentRoom.id);
    }
    setCurrentRoom(room);
    setMessages([]);
    setTypingUsers([]);
    socketService.joinRoom(room.id);
  };

  const sendMessage = (content: string) => {
    if (!currentRoom || !content.trim()) return;
    socketService.sendMessage(content.trim(), currentRoom.id);
  };

  const startTyping = () => {
    if (!currentRoom) return;
    socketService.startTyping(currentRoom.id);
  };

  const stopTyping = () => {
    if (!currentRoom) return;
    socketService.stopTyping(currentRoom.id);
  };

  return (
    <ChatContext.Provider value={{
      rooms,
      currentRoom,
      messages,
      onlineUsers,
      typingUsers,
      selectRoom,
      sendMessage,
      startTyping,
      stopTyping
    }}>
      {children}
    </ChatContext.Provider>
  );
};