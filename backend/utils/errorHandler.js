class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ApiError extends ErrorHandler {
  constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
    super(message, statusCode);
    this.errors = errors;
    this.data = null;

    if (stack) {
      this.stack = stack;
    }
  }
}

class InvalidObjectIdError extends ErrorHandler {
  constructor(id) {
    super(`Resource with ID ${id} not found. Invalid ObjectId format.`, 400);
    this.name = 'InvalidObjectIdError';
  }
}

class JWTError extends ErrorHandler {
  constructor(message = 'Invalid or expired token') {
    super(message, 401);
    this.name = 'JWTError';
  }
}

class ValidationError extends ErrorHandler {
  constructor(errors) {
    const message = 'Validation failed';
    super(message, 400);
    this.name = 'ValidationError';
    this.validationErrors = errors;
  }
}

class DuplicateFieldError extends ErrorHandler {
  constructor(field, value) {
    const message = `Duplicate field value: ${field} with value ${value} already exists.`;
    super(message, 400);
    this.name = 'DuplicateFieldError';
    this.field = field;
    this.value = value;
  }
}

class ResourceNotFoundError extends ErrorHandler {
  constructor(resource, id) {
    super(`${resource} with ID ${id} not found`, 404);
    this.name = 'ResourceNotFoundError';
    this.resource = resource;
    this.id = id;
  }
}

export {
  ErrorHandler,
  ApiError,
  InvalidObjectIdError,
  JWTError,
  ValidationError,
  DuplicateFieldError,
  ResourceNotFoundError
};