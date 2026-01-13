import cloudinary from '../utils/cloudinary.js';
import catchAsyncError from '../middleware/catchAsyncError.js';
import { ErrorHandler } from '../utils/errorHandler.js';

export const uploadImage = catchAsyncError(async (req, res, next) => {
    const { image } = req.body;

    if (!image) {
        return next(new ErrorHandler('No image provided', 400));
    }

    const result = await cloudinary.uploader.upload(image, {
        folder: 'cartify_products',
        width: 150,
        crop: "scale"
    });

    res.status(200).json({
        success: true,
        public_id: result.public_id,
        url: result.secure_url
    });
});

export const deleteImage = catchAsyncError(async (req, res, next) => {
    const { public_id } = req.body;

    if (!public_id) {
        return next(new ErrorHandler('Public ID is required', 400));
    }

    await cloudinary.uploader.destroy(public_id);

    res.status(200).json({
        success: true,
        message: 'Image deleted from Cloudinary'
    });
});
