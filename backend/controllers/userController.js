import User from '../models/userTable.js';
import catchAsyncError from '../middleware/catchAsyncError.js';
import { ErrorHandler } from '../utils/errorHandler.js';

export const getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user
  });
});

export const addToWatchlist = catchAsyncError(async (req, res, next) => {
  const { productId } = req.body;
  const user = await User.findById(req.user.id);

  if (!user.watchlist.some(id => id.toString() === productId.toString())) {
    user.watchlist.push(productId);
    await user.save({ validateBeforeSave: false });
  }

  res.status(200).json({
    success: true,
    message: 'Added to watchlist',
    watchlist: user.watchlist
  });
});

export const removeFromWatchlist = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;
  const user = await User.findById(req.user.id);

  user.watchlist = user.watchlist.filter(id => id.toString() !== productId);
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Removed from watchlist',
    watchlist: user.watchlist
  });
});

export const getWatchlist = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('watchlist');

  res.status(200).json({
    success: true,
    watchlist: user.watchlist
  });
});