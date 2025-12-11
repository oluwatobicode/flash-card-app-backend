import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodType, ZodError } from "zod";
import { HTTP_STATUS } from "../config";

interface ValidationSchemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

interface ValidationError {
  field: string;
  message: string;
}

/**
 * Format Zod errors into a readable array
 */
const formatZodErrors = (error: ZodError): ValidationError[] => {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
};

/**
 * Validation middleware factory
 * Validates request body, params, and query against Zod schemas
 *
 * @param schemas - Object containing optional body, params, and query schemas
 * @returns Express middleware function
 */
export const validate = (schemas: ValidationSchemas): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationError[] = [];

    // Validate body
    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errors.push(
          ...formatZodErrors(result.error).map((e) => ({
            ...e,
            field: e.field ? `body.${e.field}` : "body",
          })),
        );
      } else {
        req.body = result.data;
      }
    }

    // Validate params
    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errors.push(
          ...formatZodErrors(result.error).map((e) => ({
            ...e,
            field: e.field ? `params.${e.field}` : "params",
          })),
        );
      }
    }

    // Validate query
    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errors.push(
          ...formatZodErrors(result.error).map((e) => ({
            ...e,
            field: e.field ? `query.${e.field}` : "query",
          })),
        );
      }
    }

    if (errors.length > 0) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: "error",
        message: "Validation failed",
        errors,
      });
      return;
    }

    next();
  };
};
