import React from 'react';
import { Hash, Users, LogOut } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { rooms, currentRoom, selectRoom, onlineUsers } = useChat();
  const { logout, user } = useAuth();

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">ChatApp</h1>
          <button
            onClick={logout}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        {user && (
          <div className="flex items-center mt-2">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>
        )}
      </div>

      {/* Rooms */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Rooms
          </h2>
          <div className="space-y-1">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => selectRoom(room)}
                className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                  currentRoom?.id === room.id
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Hash className="w-5 h-5 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{room.name}</p>
                  <p className="text-sm text-gray-500 truncate">{room.description}</p>
                </div>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  {room.memberCount}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Online Users */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <Users className="w-4 h-4 mr-2 text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Online ({onlineUsers.length})
            </h2>
          </div>
          <div className="space-y-2">
            {onlineUsers.map((onlineUser) => (
              <div key={onlineUser.id} className="flex items-center">
                <div className="relative">
                  <img
                    src={onlineUser.avatar}
                    alt={onlineUser.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <span className="ml-3 text-sm text-gray-700 truncate">
                  {onlineUser.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;