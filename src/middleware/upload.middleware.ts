import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

// File size limit: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_MIME_TYPES = ["application/pdf"];

/**
 * File filter to only accept PDF files
 */
const pdfFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

/**
 * Multer configuration for PDF uploads
 * Uses memory storage (buffer) for processing
 */
const storage = multer.memoryStorage();

/**
 * PDF upload middleware
 * - Stores file in memory as buffer
 * - Max size: 10MB
 * - Only accepts PDF files
 */
export const uploadPdf = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: pdfFileFilter,
});

/**
 * Single PDF upload middleware
 * Field name: "file"
 */
export const singlePdfUpload = uploadPdf.single("file");
