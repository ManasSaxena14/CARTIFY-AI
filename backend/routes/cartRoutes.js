import express from 'express';
import { 
  addToCart,
  getMyCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/add').post(protect, addToCart);
router.route('/').get(protect, getMyCart);
router.route('/update').put(protect, updateCartItemQuantity);
router.route('/remove/:productId').delete(protect, removeItemFromCart);
router.route('/clear').delete(protect, clearCart);

export default router;