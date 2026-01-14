import express from 'express';
import {
    createPaymentIntent,
    placeOrder,
    myOrders,
    getSingleOrder,
    getAllOrdersAdmin,
    updateOrderStatus,
    deleteOrder
} from '../controllers/orderController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/create-payment-intent').post(protect, createPaymentIntent);
router.route('/place').post(protect, placeOrder);
router.route('/my').get(protect, myOrders);
router.route('/:id').get(protect, getSingleOrder);

export default router;
