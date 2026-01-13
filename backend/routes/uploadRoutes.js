import express from 'express';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/upload', protect, authorizeRoles('admin'), uploadImage);
router.post('/delete', protect, authorizeRoles('admin'), deleteImage);

export default router;
