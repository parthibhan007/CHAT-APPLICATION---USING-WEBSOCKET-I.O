import React from 'react';
import { TypingUser } from '../../types/chat';

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;

  const typingNames = typingUsers.map(user => user.userName);
  let text = '';

  if (typingNames.length === 1) {
    text = `${typingNames[0]} is typing...`;
  } else if (typingNames.length === 2) {
    text = `${typingNames[0]} and ${typingNames[1]} are typing...`;
  } else {
    text = `${typingNames.length} people are typing...`;
  }

  return (
    <div className="flex items-center px-6 py-2">
      <div className="flex space-x-1 mr-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <p className="text-sm text-gray-500 italic">{text}</p>
    </div>
  );
};

export default TypingIndicator;