import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

let socket = null;

export const initSocket = (userId) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to Socket.io backend:', socket.id);
      if (userId) {
        socket.emit('user_online', userId);
      }
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from Socket.io backend');
    });
  }

  return socket;
};

export const getSocket = () => socket;

export const joinConversationRoom = (conversationId) => {
  if (socket && conversationId) {
    socket.emit('join_conversation', conversationId);
  }
};

export const leaveConversationRoom = (conversationId) => {
  if (socket && conversationId) {
    socket.emit('leave_conversation', conversationId);
  }
};

export const emitSocketMessage = (data) => {
  if (socket) {
    socket.emit('send_message', data);
  }
};

export const emitTypingStatus = (conversationId, userId, userName, isTyping) => {
  if (socket) {
    if (isTyping) {
      socket.emit('typing_start', { conversationId, userId, userName });
    } else {
      socket.emit('typing_stop', { conversationId, userId });
    }
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
