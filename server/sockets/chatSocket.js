/**
 * Real-Time Socket.io Event Architecture
 */

export const setupChatSockets = (io) => {
  const onlineUsers = new Map(); // userId -> socketId

  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    // User authenticates/identifies on socket connection
    socket.on('user_online', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('user_status_changed', { userId, status: 'Online' });
    });

    // Join a specific conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`[Socket] ${socket.id} joined room: ${conversationId}`);
    });

    // Leave a conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(conversationId);
    });

    // Real-time Message Relay
    socket.on('send_message', (data) => {
      const { conversationId, senderId, text, timestamp } = data;
      
      // Broadcast to everyone in the conversation room except sender
      socket.to(conversationId).emit('receive_message', {
        id: 'msg_' + Date.now(),
        conversationId,
        senderId,
        text,
        timestamp: timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    });

    // Real-time Typing Status
    socket.on('typing_start', ({ conversationId, userId, userName }) => {
      socket.to(conversationId).emit('user_typing', { userId, userName, isTyping: true });
    });

    socket.on('typing_stop', ({ conversationId, userId }) => {
      socket.to(conversationId).emit('user_typing', { userId, isTyping: false });
    });

    // Disconnect
    socket.on('disconnect', () => {
      let disconnectedUserId = null;
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          onlineUsers.delete(userId);
          break;
        }
      }

      if (disconnectedUserId) {
        io.emit('user_status_changed', { userId: disconnectedUserId, status: 'Offline' });
      }
      console.log(`[Socket] User disconnected: ${socket.id}`);
    });
  });
};
