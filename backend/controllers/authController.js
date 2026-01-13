import User from '../models/userTable.js';
import { asyncHandler } from '../utils/apiResponse.js';
import { ErrorHandler } from '../utils/errorHandler.js';
import crypto from 'crypto';
import generateForgotPasswordEmail from '../utils/generateForgotPasswordEmail.js';
import sendEmail from '../utils/sendEmail.js';

export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler('Please provide name, email, and password', 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler('User already exists with this email', 409));
  }

  const user = await User.create({
    name,
    email,
    password
  });

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  user.password = undefined;

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      accessToken
    }
  });
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  user.password = undefined;

  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    data: {
      user,
      accessToken
    }
  });
});

export const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
});

export const getLoggedInUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    message: 'User profile retrieved successfully',
    data: user
  });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler('Please provide email address', 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler('User not found with this email', 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  try {
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

    const { html, text } = generateForgotPasswordEmail(user, resetUrl);

    await sendEmail({
      email: user.email,
      subject: 'Cartify AI - Password Recovery',
      html,
      text
    });

    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully'
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler('Email could not be sent', 500));
  }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorHandler('Password reset token is invalid or has expired', 400));
  }

  const { password } = req.body;

  if (!password) {
    return next(new ErrorHandler('Please provide new password', 400));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(200).json({
    success: true,
    message: 'Password reset successfully',
    data: {
      accessToken
    }
  });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(new ErrorHandler('Please provide old and new password', 400));
  }

  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  const isPasswordMatch = await user.comparePassword(oldPassword);
  if (!isPasswordMatch) {
    return next(new ErrorHandler('Old password is incorrect', 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;

  const newUserData = {};
  if (name) newUserData.name = name;
  if (email) newUserData.email = email;

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});

