import React from 'react';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatInterface = () => {
  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <MessageList />
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatInterface;