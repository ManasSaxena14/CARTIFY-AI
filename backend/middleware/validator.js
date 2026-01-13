import { validationResult } from 'express-validator';
import { ErrorHandler } from '../utils/errorHandler.js';

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    const errorMessage = errors.array().map(err => err.msg).join(', ');

    return next(new ErrorHandler(errorMessage, 400));
};
