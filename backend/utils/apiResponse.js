import { ApiError } from './errorHandler.js';

const ApiResponse = (statusCode, data, message = "Success") => {
  return {
    success: true,
    statusCode,
    message,
    data,
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((next));
  };
};

export { ApiError, ApiResponse, asyncHandler };