import express from 'express';
import {
    getAllUsers,
    getSingleUser,
    updateUserRole,
    deleteUser,
    getAdminProducts,
    getLowStockProducts,
    dashboardStats,
    exportAIReport,
    getAllReviews,
    deleteReview
} from '../controllers/adminController.js';
import {
    getAllOrdersAdmin,
    updateOrderStatus,
    deleteOrder
} from '../controllers/orderController.js';

import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorizeRoles('admin'));

router.route('/users').get(getAllUsers);
router.route('/users/:id')
    .get(getSingleUser)
    .delete(deleteUser);
router.route('/users/:id/role').put(updateUserRole);

router.route('/products').get(getAdminProducts);
router.route('/products/low-stock').get(getLowStockProducts);

router.route('/orders').get(getAllOrdersAdmin);
router.route('/orders/:id')
    .delete(deleteOrder);
router.route('/orders/:id/status').put(updateOrderStatus);

router.route('/dashboard').get(dashboardStats);
router.route('/report').get(exportAIReport);

router.route('/reviews').get(getAllReviews);
router.route('/reviews/:productId/:reviewId').delete(deleteReview);

export default router;
