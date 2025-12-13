import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { UPLOAD } from "../config";

/**
 * File filter to only accept PDF files
 */
const pdfFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  if (UPLOAD.ALLOWED_PDF_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

/**
 * File filter to only accept image files
 */
const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  if (UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
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
    fileSize: UPLOAD.MAX_PDF_SIZE,
  },
  fileFilter: pdfFileFilter,
});

/**
 * Single PDF upload middleware
 * Field name: "file"
 */
export const singlePdfUpload = uploadPdf.single("file");

/**
 * Image upload middleware
 * - Stores file in memory as buffer
 * - Max size: 5MB
 * - Only accepts JPEG, PNG, WebP images
 */
export const uploadImage = multer({
  storage,
  limits: {
    fileSize: UPLOAD.MAX_IMAGE_SIZE,
  },
  fileFilter: imageFileFilter,
});

/**
 * Single image upload middleware
 * Field name: "profilePicture"
 */
export const singleImageUpload = uploadImage.single("profilePicture");
