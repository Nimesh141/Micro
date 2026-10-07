# 🚀 ChatApp Backend Architecture

A lightweight, real-time backend architecture for the pastel geometric ChatApp built with **Node.js, Express, Socket.io, and MongoDB**.

---

## 🏗️ Folder Structure

```
server/
├── config/
│   └── .env.example          # Environment variables template
├── controllers/
│   ├── authController.js     # Auth business logic (login, signup, session)
│   └── chatController.js     # Chat business logic (conversations & messages)
├── models/
│   ├── User.js               # User schema
│   ├── Conversation.js       # Conversation / Room schema
│   └── Message.js            # Message schema
├── routes/
│   ├── authRoutes.js         # /api/auth routes
│   └── chatRoutes.js         # /api/chat routes
├── sockets/
│   └── chatSocket.js         # Real-time WebSocket event handler
├── index.js                  # Main server entry point
└── package.json              # Server dependencies & scripts
```

---

## 🗄️ Database Schemas (Models)

### 1. User (`models/User.js`)
- `name`: String
- `email`: String (Unique)
- `password`: Hashed String
- `avatarColor`: String (`#C4F1F7` / `#C9BDF2`)
- `avatarInitials`: String (`AJ`)
- `status`: String (`Online` / `Offline`)
- `role`: String
- `bio`: String

### 2. Conversation (`models/Conversation.js`)
- `participants`: Array of `User` ObjectIds
- `lastMessage`: String
- `lastMessageSender`: `User` ObjectId
- `isGroup`: Boolean

### 3. Message (`models/Message.js`)
- `conversationId`: `Conversation` ObjectId
- `senderId`: `User` ObjectId
- `text`: String
- `readBy`: Array of `User` ObjectIds

---

## 📡 REST API Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Login user & return JWT token |
| `GET` | `/api/auth/me` | Fetch authenticated user details |
| `GET` | `/api/chat/conversations` | Fetch active user conversations |
| `GET` | `/api/chat/messages/:id` | Fetch message history for a conversation |
| `POST` | `/api/chat/messages` | Post a new message via REST |

---

## ⚡ Socket.io Real-Time Events (`sockets/chatSocket.js`)

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `user_online` | Client ➔ Server | `userId` | Registers user as online |
| `join_conversation` | Client ➔ Server | `conversationId` | Joins a conversation socket room |
| `send_message` | Client ➔ Server | `{ conversationId, text }` | Emits a new message to the room |
| `receive_message` | Server ➔ Client | `{ id, text, senderId, timestamp }` | Broadcasts message to room members |
| `typing_start` | Client ➔ Server | `{ conversationId, userId }` | Broadcasts typing status |
| `user_typing` | Server ➔ Client | `{ userId, isTyping }` | Displays typing indicator on UI |

---

## 🛠️ How to Run Backend

1. Navigate to server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.
