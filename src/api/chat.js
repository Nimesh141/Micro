import { apiClient } from './client';

export const chatAPI = {
  getConversations: async () => {
    return apiClient('/chat/conversations', {
      method: 'GET',
    });
  },

  createConversation: async (recipientId) => {
    return apiClient('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify({ recipientId }),
    });
  },

  getMessages: async (conversationId) => {
    return apiClient(`/chat/messages/${conversationId}`, {
      method: 'GET',
    });
  },

  sendMessage: async (conversationId, text) => {
    return apiClient('/chat/messages', {
      method: 'POST',
      body: JSON.stringify({ conversationId, text }),
    });
  },
};
