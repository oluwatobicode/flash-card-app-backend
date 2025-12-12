import { HTTP_STATUS, ERROR_MESSAGES } from "../config";

/**
 * Base exception class for application errors
 */
export class AppException extends Error {
  constructor(
    public statusCode: number,
    public override message: string,
    public isOperational: boolean = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppException.prototype);
  }
}

/**
 * 404 Not Found - Resource does not exist
 */
export class NotFoundException extends AppException {
  constructor(message: string = ERROR_MESSAGES.NOT_FOUND) {
    super(HTTP_STATUS.NOT_FOUND, message);
  }
}

/**
 * 400 Bad Request - Invalid input or request
 */
export class BadRequestException extends AppException {
  constructor(message: string = "Bad request") {
    super(HTTP_STATUS.BAD_REQUEST, message);
  }
}

/**
 * 401 Unauthorized - Not authenticated
 */
export class UnauthorizedException extends AppException {
  constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED) {
    super(HTTP_STATUS.UNAUTHORIZED, message);
  }
}

/**
 * 403 Forbidden - Authenticated but not authorized
 */
export class ForbiddenException extends AppException {
  constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED) {
    super(HTTP_STATUS.FORBIDDEN, message);
  }
}

/**
 * 409 Conflict - Resource already exists
 */
export class ConflictException extends AppException {
  constructor(message: string = ERROR_MESSAGES.DUPLICATE_ENTRY) {
    super(HTTP_STATUS.CONFLICT, message);
  }
}

/**
 * 500 Internal Server Error - Unexpected server error
 */
export class InternalServerException extends AppException {
  constructor(message: string = ERROR_MESSAGES.SERVER_ERROR) {
    super(HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
  }
}
