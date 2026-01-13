import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  getLoggedInUser,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/register').post(
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  validate,
  registerUser
);

router.route('/login').post(
  [
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  validate,
  loginUser
);
router.route('/logout').post(logoutUser);
router.route('/forgot-password').post(
  [
    body('email', 'Please enter a valid email').isEmail()
  ],
  validate,
  forgotPassword
);
router.route('/reset-password/:token').put(
  [
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  validate,
  resetPassword
);

router.route('/me').get(protect, getLoggedInUser);
router.route('/update-password').put(
  protect,
  [
    body('oldPassword', 'Old password is required').exists(),
    body('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
  ],
  validate,
  updatePassword
);
router.route('/update-profile').put(
  protect,
  [
    body('email', 'Please enter a valid email').optional().isEmail()
  ],
  validate,
  updateProfile
);

export default router;