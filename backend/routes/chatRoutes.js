import express from 'express';
import { chatWithAI } from '../controllers/chatController.js';
const router = express.Router();

router.route('/message').post(chatWithAI);

export default router;
