export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid email or password",
  UNAUTHORIZED: "You are not authorized to perform this action",
  NOT_FOUND: "Resource not found",
  VALIDATION_ERROR: "Validation error",
  SERVER_ERROR: "Internal server error",
  DUPLICATE_ENTRY: "Resource already exists",
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  SIGNUP_SUCCESS: "Signup successful",
  UPDATE_SUCCESS: "Update successful",
  DELETE_SUCCESS: "Delete successful",
  CREATE_SUCCESS: "Create successful",
};

export const API_VERSION = "v1";

// Time constants (in seconds)
export const TIME = {
  ONE_HOUR: 60 * 60,
  ONE_DAY: 60 * 60 * 24,
  ONE_WEEK: 60 * 60 * 24 * 7,
};

// Session configuration
export const SESSION = {
  EXPIRES_IN: TIME.ONE_WEEK, // 7 days
  UPDATE_AGE: TIME.ONE_DAY, // 1 day
};

// Upload configuration
export const UPLOAD = {
  MAX_PDF_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_PDF_TYPES: ["application/pdf"],
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
};
