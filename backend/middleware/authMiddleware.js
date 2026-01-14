import User from '../models/userTable.js';
import { ErrorHandler } from '../utils/errorHandler.js';
import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ErrorHandler('Not authorized to access this route', 401));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return next(new ErrorHandler('User not found', 404));
      }

      next();
    } catch (err) {
      return next(new ErrorHandler('Invalid token', 401));
    }

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ErrorHandler('Invalid token', 401));
    }

    if (error.name === 'TokenExpiredError') {
      return next(new ErrorHandler('Token expired', 401));
    }

    return next(new ErrorHandler('Not authorized to access this route', 401));
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};