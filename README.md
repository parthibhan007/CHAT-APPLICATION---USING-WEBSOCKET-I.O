# 💬 Real-Time Chat Application

COMPANY : CODTECH IT SOLUTIONS

NAME    : PARTHIBHAN R

INTERN ID : CT04DY372

DOMAIN : FULL STACK WEB DEVELOPMENT

DURATION : 4 WEEKS

MENTIOR :  NEELA SANTHOSH

DISCRIPTION : -

A modern, professional real-time chat application built with React.js (frontend) and Node.js + Socket.IO (backend). Perfect for demonstrating full-stack development skills in internships and professional environments.

## ✨ Features

- **🔐 JWT-based Authentication**: Secure login/register system with token-based authentication
- **⚡ Real-Time Messaging**: Instant messaging using Socket.IO WebSocket connections
- **💾 Message Persistence**: All messages are stored and retrieved (using in-memory storage for demo)
- **👥 User Presence**: Online/offline status indicators and user lists
- **⌨️ Typing Indicators**: Real-time typing notifications
- **🏠 Multiple Rooms**: Support for different chat rooms (General, Random)
- **🔔 Desktop Notifications**: Browser notifications for new messages
- **📱 Responsive Design**: Modern UI that works on desktop, tablet, and mobile
- **🎨 Professional UI**: WhatsApp-inspired clean and intuitive interface

## 🛠️ Tech Stack

### Frontend
- **React.js 18** with TypeScript
- **TailwindCSS** for styling
- **Socket.IO Client** for real-time communication
- **React Context API** for state management
- **React Hot Toast** for notifications
- **Lucide React** for icons
- **Date-fns** for date formatting

### Backend
- **Node.js** with Express.js
- **Socket.IO** for WebSocket connections
- **CORS** for cross-origin requests
- **UUID** for unique ID generation
- In-memory storage (easily replaceable with MongoDB/PostgreSQL)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 2. Start the Backend Server

```bash
# From the server directory
cd server
npm run dev
```

The backend server will start on `http://localhost:3001`

### 3. Start the Frontend Application

```bash
# From the root directory
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Open Your Browser

Visit `http://localhost:5173` and create an account or login to start chatting!

## 📁 Project Structure

```
/
├── src/                          # Frontend source code
│   ├── components/
│   │   ├── auth/                 # Authentication components
│   │   │   ├── AuthPage.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   └── chat/                 # Chat interface components
│   │       ├── ChatInterface.tsx
│   │       ├── Sidebar.tsx
│   │       ├── MessageList.tsx
│   │       ├── MessageBubble.tsx
│   │       ├── MessageInput.tsx
│   │       ├── ChatHeader.tsx
│   │       └── TypingIndicator.tsx
│   ├── context/                  # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── ChatContext.tsx
│   ├── services/                 # API and Socket services
│   │   ├── auth.ts
│   │   └── socket.ts
│   ├── types/                    # TypeScript type definitions
│   │   └── chat.ts
│   ├── App.tsx                   # Main application component
│   └── main.tsx                  # Application entry point
├── server/                       # Backend source code
│   ├── index.js                  # Express + Socket.IO server
│   └── package.json              # Backend dependencies
└── README.md
```

## 🔧 Configuration

### Environment Variables

The application works out of the box with default settings. For production deployment, you may want to configure:

**Backend (`server/.env`):**
```env
PORT=3001
NODE_ENV=production
```

**Frontend (`.env`):**
```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/health` - Health check

### Socket.IO Events

#### Client → Server
- `user:join` - Join chat with user data
- `message:send` - Send a new message
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator
- `room:join` - Join a specific room
- `room:leave` - Leave a specific room

#### Server → Client
- `user:online` - User came online
- `user:offline` - User went offline
- `users:online` - List of online users
- `rooms:list` - Available rooms
- `message:new` - New message received
- `messages:history` - Message history for a room
- `typing:start` - User started typing
- `typing:stop` - User stopped typing

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Update environment variables for production API URLs

### Backend (Render/Railway/Heroku)
1. Deploy the `server` directory
2. Set environment variables
3. Ensure the port is configured correctly

### Docker Deployment
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/ .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🔒 Security Features

- Input validation and sanitization
- CORS protection
- Rate limiting ready (commented in code)
- XSS prevention through proper data handling
- Secure token-based authentication

## 🎯 Internship-Ready Features

This project demonstrates:
- **Full-stack development** skills
- **Real-time communication** implementation
- **Modern React patterns** (Hooks, Context API)
- **TypeScript** usage for type safety
- **Clean code architecture** with separation of concerns
- **Professional UI/UX** design
- **State management** best practices
- **Error handling** and user feedback
- **Responsive design** principles
- **WebSocket** communication

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Socket connection fails**
   - Ensure backend server is running on port 3001
   - Check if ports are not blocked by firewall

2. **Messages not sending**
   - Verify Socket.IO connection in browser dev tools
   - Check console for error messages

3. **Authentication issues**
   - Clear browser localStorage
   - Restart both frontend and backend servers

### Need Help?

- Check browser console for error messages
- Verify both servers are running
- Ensure all dependencies are installed correctly

---

**🎉 Happy Coding! This project is ready for internship demonstrations and professional portfolios.**
