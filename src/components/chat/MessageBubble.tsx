import React from 'react';
import { format } from 'date-fns';
import { Message } from '../../types/chat';
import { useAuth } from '../../context/AuthContext';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { user } = useAuth();
  const isOwnMessage = user?.id === message.user.id;

  return (
    <div className={`flex mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isOwnMessage && (
          <img
            src={message.user.avatar}
            alt={message.user.name}
            className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
          />
        )}
        
        <div
          className={`px-4 py-2 rounded-lg ${
            isOwnMessage
              ? 'bg-blue-600 text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
          }`}
        >
          {!isOwnMessage && (
            <p className="text-xs font-medium text-gray-600 mb-1">{message.user.name}</p>
          )}
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          <p
            className={`text-xs mt-1 ${
              isOwnMessage ? 'text-blue-100' : 'text-gray-500'
            }`}
          >
            {format(new Date(message.timestamp), 'HH:mm')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;