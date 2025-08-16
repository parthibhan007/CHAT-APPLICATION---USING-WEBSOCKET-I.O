import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage for demo (in production, use a real database)
const users = new Map();
const messages = new Map();
const rooms = new Map();
const onlineUsers = new Map();

// Default rooms
rooms.set('general', {
  id: 'general',
  name: 'General',
  description: 'General discussion',
  members: new Set(),
  messages: []
});

rooms.set('random', {
  id: 'random',
  name: 'Random',
  description: 'Random conversations',
  members: new Set(),
  messages: []
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Chat server is running' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // Simple auth for demo (in production, use proper authentication)
  let user = Array.from(users.values()).find(u => u.email === email);
  
  if (!user) {
    // Create new user if doesn't exist
    user = {
      id: uuidv4(),
      email,
      name: email.split('@')[0],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=3B82F6&color=fff`,
      createdAt: new Date().toISOString()
    };
    users.set(user.id, user);
  }

  res.json({
    user,
    token: `demo-token-${user.id}` // In production, use real JWT
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // Check if user exists
  const existingUser = Array.from(users.values()).find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const user = {
    id: uuidv4(),
    email,
    name: name || email.split('@')[0],
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email.split('@')[0])}&background=3B82F6&color=fff`,
    createdAt: new Date().toISOString()
  };
  
  users.set(user.id, user);

  res.json({
    user,
    token: `demo-token-${user.id}`
  });
});

// Socket.IO handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user:join', (userData) => {
    const user = users.get(userData.id);
    if (user) {
      onlineUsers.set(socket.id, user);
      socket.userId = userData.id;
      
      // Join default rooms
      socket.join('general');
      socket.join('random');
      
      // Add user to room members
      rooms.get('general').members.add(userData.id);
      rooms.get('random').members.add(userData.id);
      
      // Notify others that user is online
      socket.broadcast.emit('user:online', user);
      
      // Send online users list
      const onlineUsersList = Array.from(onlineUsers.values());
      socket.emit('users:online', onlineUsersList);
      
      // Send room list
      const roomsList = Array.from(rooms.values()).map(room => ({
        id: room.id,
        name: room.name,
        description: room.description,
        memberCount: room.members.size
      }));
      socket.emit('rooms:list', roomsList);
    }
  });

  socket.on('message:send', (messageData) => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;

    const message = {
      id: uuidv4(),
      content: messageData.content,
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      },
      roomId: messageData.roomId,
      timestamp: new Date().toISOString(),
      type: messageData.type || 'text'
    };

    // Store message
    if (!messages.has(messageData.roomId)) {
      messages.set(messageData.roomId, []);
    }
    messages.get(messageData.roomId).push(message);
    
    // Add to room messages
    const room = rooms.get(messageData.roomId);
    if (room) {
      room.messages.push(message);
      // Keep only last 100 messages per room
      if (room.messages.length > 100) {
        room.messages = room.messages.slice(-100);
      }
    }

    // Emit to room
    io.to(messageData.roomId).emit('message:new', message);
  });

  socket.on('typing:start', (data) => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      socket.to(data.roomId).emit('typing:start', {
        userId: user.id,
        userName: user.name,
        roomId: data.roomId
      });
    }
  });

  socket.on('typing:stop', (data) => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      socket.to(data.roomId).emit('typing:stop', {
        userId: user.id,
        roomId: data.roomId
      });
    }
  });

  socket.on('room:join', (roomId) => {
    socket.join(roomId);
    
    // Send room messages
    const roomMessages = messages.get(roomId) || [];
    socket.emit('messages:history', {
      roomId,
      messages: roomMessages.slice(-50) // Last 50 messages
    });
  });

  socket.on('room:leave', (roomId) => {
    socket.leave(roomId);
  });

  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      onlineUsers.delete(socket.id);
      
      // Remove from room members
      rooms.forEach(room => {
        room.members.delete(user.id);
      });
      
      // Notify others that user is offline
      socket.broadcast.emit('user:offline', user);
    }
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Chat server running on http://localhost:${PORT}`);
});