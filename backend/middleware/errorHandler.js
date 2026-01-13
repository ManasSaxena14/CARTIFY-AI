import { InvalidObjectIdError, JWTError, ValidationError, DuplicateFieldError, ResourceNotFoundError } from '../utils/errorHandler.js';

const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`;
    error = new InvalidObjectIdError(err.value);
  }

  if (err.name === 'ValidationError' && err.errors) {
    const message = Object.values(err.errors).map(value => value.message);
    error = new ValidationError(message);
  }

  if (err.code === 11000) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value entered: ${value}. Please use another value.`;
    error = new DuplicateFieldError(err.keyPattern, value);
  }
  if (err.name === 'JsonWebTokenError') {
    error = new JWTError('Invalid token. Please log in again.');
  }

  if (err.name === 'TokenExpiredError') {
    error = new JWTError('Token expired. Please log in again.');
  }

  if (process.env.NODE_ENV === 'production') {
    let prodError = { ...error };

    if (!err.isOperational) {
      prodError.message = 'Something went wrong!';

      res.status(error.statusCode || 500).json({
        success: false,
        error: prodError.message,
      });

      return;
    }

    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      ...(error.validationErrors && { validationErrors: error.validationErrors }),
    });
  } else {

    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      stack: err.stack,
      ...(error.validationErrors && { validationErrors: error.validationErrors }),
      ...(error.field && { field: error.field }),
      ...(error.value && { value: error.value }),
      ...(error.resource && { resource: error.resource }),
      ...(error.id && { id: error.id }),
    });
  }
};

const handleUnhandledRoutes = (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  err.status = 'fail';
  next(err);
};

const handleUnhandledRejection = (reason, promise) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  }
  process.exit(1);
};

const handleUncaughtException = (err) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Uncaught Exception:', err);
  }
  process.exit(1);
};

export {
  globalErrorHandler,
  handleUnhandledRoutes,
  handleUnhandledRejection,
  handleUncaughtException
};