import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadLogoToCloudinary = (
  fileBuffer: Buffer,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "logo",
      },
      (error, result) => {
        if (error || !result) {
          return reject(error);
        }
        resolve(result);
      },
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export const uploadProfilePictureToCloudinary = (
  fileBuffer: Buffer,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "profile-pictures",
      },
      (error, result) => {
        if (error || !result) {
          return reject(error);
        }
        resolve(result);
      },
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export const uploadCompressedImageToCloudinary = (
  fileBuffer: Buffer,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "compressed-images",
      },
      (error, result) => {
        if (error || !result) {
          return reject(error);
        }
        resolve(result);
      },
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
