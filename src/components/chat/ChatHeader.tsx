import React from 'react';
import { Hash } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const ChatHeader = () => {
  const { currentRoom, onlineUsers } = useChat();

  if (!currentRoom) {
    return (
      <div className="h-16 border-b border-gray-200 flex items-center justify-center bg-white">
        <p className="text-gray-500">Select a room to start chatting</p>
      </div>
    );
  }

  return (
    <div className="h-16 border-b border-gray-200 flex items-center px-6 bg-white">
      <Hash className="w-5 h-5 text-gray-600 mr-2" />
      <div>
        <h1 className="font-semibold text-gray-900">{currentRoom.name}</h1>
        <p className="text-sm text-gray-500">
          {currentRoom.memberCount} members • {onlineUsers.length} online
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;