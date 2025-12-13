import { v2 as cloudinary } from "cloudinary";
import { config } from "../config";

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

/**
 * Upload profile picture to Cloudinary
 * @param fileBuffer - The image file buffer
 * @param userId - The user ID for folder organization
 * @returns Upload result with secure URL
 */
export const uploadProfilePicture = async (
  fileBuffer: Buffer,
  userId: string,
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `profile-pictures/${userId}`,
        transformation: [
          { width: 500, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
          });
        } else {
          reject(new Error("Upload failed: No result returned"));
        }
      },
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete profile picture from Cloudinary
 * @param publicId - The Cloudinary public ID of the image
 */
export const deleteProfilePicture = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
