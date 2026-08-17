import cloudinary from "../../config/cloudinary.js";
import AppError from "../../utils/errors/AppError.js";
import { getPagination } from "../../utils/pagination.js";
import compressToTargetSize from "../../utils/compressToTagregtSize.js";
import { getSharpFormat } from "../../utils/getSharpFormat.js";
import { uploadCompressedImageToCloudinary } from "../../utils/uploadToCloudinary.js";
import Compress from "./compress.model.js";

export const compressImageService = async (
  file: Express.Multer.File,
  percent: number,
  userId: any
) => {
  const originalSize = file.size;
  const targetSize = originalSize * (1 - percent / 100);

  const compressedBuffer = await compressToTargetSize(
    file.buffer,
    targetSize,
    getSharpFormat(file.mimetype),
  );

  const uploaded = await uploadCompressedImageToCloudinary(compressedBuffer);

  const record = await Compress.create({
    user: userId,

    imageName: file.originalname,
    originalSize,

    compressedSize: compressedBuffer.length,

    compressionPercentage: 100 - (compressedBuffer.length / originalSize) * 100,

    originalFormat: file.mimetype,
    compressedFormat: "image/jpeg",

    images: {
      compressedImage: {
        publicId: uploaded.public_id,
        secureUrl: uploaded.secure_url,
      },
    },
  });

  return record;
};

export const getHistoryService = async (
  userId: string,
  page = 1,
  limit = 20,
) => {
  const { skip } = getPagination(page, limit);

  const [history, total] = await Promise.all([
    Compress.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Compress.countDocuments({ user: userId }),
  ]);

  return {
    history,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const getImageByIdService = async (id: string, userId: string) => {
  const image = await Compress.findById(id);

  if (!image) {
    throw new AppError("Image not found", 404);
  }

  if (image.user && image.user.toString() !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  return image;
};

export const deleteImageService = async (userId: string, id: string) => {
  const image = await Compress.findById(id);
  if (!image) {
    throw new AppError("Image not found", 404);
  }
  if (image.user && image.user.toString() !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  if (image.images.compressedImage?.publicId) {
    try {
      await cloudinary.uploader.destroy(image.images.compressedImage.publicId);
    } catch (error) {
      console.error("Cloudinary delete failed:", error);
    }
  }

  await image.deleteOne();
  return true;
};
