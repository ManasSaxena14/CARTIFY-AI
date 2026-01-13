import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  deleteProductReview,
  aiFilteredProducts,
  aiRecommendedProducts,
  getDistinctCategories
} from '../controllers/productController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getAllProducts);

router.route('/ai-filter').post(aiFilteredProducts);

router.route('/ai-recommendation').post(aiRecommendedProducts);

router.route('/categories').get(getDistinctCategories);

router.route('/:id').get(getSingleProduct);

router.route('/').post(
  protect,
  authorizeRoles('admin'),
  [
    body('name', 'Product Name is required').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty(),
    body('price', 'Price must be a number greater than 0').isFloat({ min: 0 }),
    body('category', 'Category is required').not().isEmpty(),
    body('stock', 'Stock must be a non-negative integer').isInt({ min: 0 }),
  ],
  validate,
  createProduct
);

router.route('/:id').put(
  protect,
  authorizeRoles('admin'),
  [
    body('price', 'Price must be a number greater than 0').optional().isFloat({ min: 0 }),
    body('stock', 'Stock must be a non-negative integer').optional().isInt({ min: 0 }),
  ],
  validate,
  updateProduct
);

router.route('/:id').delete(protect, authorizeRoles('admin'), deleteProduct);

router.route('/:id/review').post(
  protect,
  [
    body('rating', 'Rating must be a number between 1 and 5').isFloat({ min: 1, max: 5 }),
    body('comment', 'Comment is required').not().isEmpty()
  ],
  validate,
  createProductReview
);
router.route('/:productId/review/:reviewId').delete(protect, deleteProductReview);


export default router;