import express from 'express';
import { 
  getConversations, 
  getMessagesByConversation, 
  postMessage,
  createConversation 
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply JWT protection middleware to all chat routes
router.use(protect);

router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.get('/messages/:conversationId', getMessagesByConversation);
router.post('/messages', postMessage);

export default router;
