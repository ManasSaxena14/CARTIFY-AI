import express from 'express';
import {
  getUserProfile,
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/me').get(protect, getUserProfile);

router.route('/watchlist')
  .get(protect, getWatchlist)
  .post(protect, addToWatchlist);

router.route('/watchlist/:productId')
  .delete(protect, removeFromWatchlist);

export default router;