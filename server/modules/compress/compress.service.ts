import cloudinary from "../../config/cloudinary.js";
import AppError from "../../utils/errors/AppError.js";
import { getPagination } from "../../utils/pagination.js";
import compressToTargetSize from "../../utils/compressToTagregtSize.js";
import { getSharpFormat } from "../../utils/getSharpFormat.js";
import { uploadCompressedImageToCloudinary } from "../../utils/uploadToCloudinary.js";
import Compress from "./compress.model.js";
import { randomUUID } from "crypto";
import { deleteFromCloudinary } from "../../utils/deleteFromCloudinary.js";

export const compressImageService = async (
  file: Express.Multer.File,
  percent: number,
  userId: any,
  history: boolean,
) => {
  const originalSize = file.size;
  const targetSize = originalSize * (1 - percent / 100);

  const outputFormat = getSharpFormat(file.mimetype);
  const compressedBuffer = await compressToTargetSize(
    file.buffer,
    targetSize,
    outputFormat,
  );

  if (!userId || !history) {
    const base64 = compressedBuffer.toString("base64");
    return {
      _id: "guest_" + randomUUID(),
      imageName: file.originalname,
      originalSize,
      compressedSize: compressedBuffer.length,
      compressionPercentage:
        100 - (compressedBuffer.length / originalSize) * 100,
      originalFormat: file.mimetype,
      compressedFormat: `image/${outputFormat}`,
      images: {
        compressedImage: {
          publicId: "guest_mock_id" + randomUUID(),
          secureUrl: `data:image/${outputFormat};base64,${base64}`,
        },
      },
    };
  }

  const uploaded = await uploadCompressedImageToCloudinary(compressedBuffer);
  const record = await Compress.create({
    user: userId,
    imageName: file.originalname,
    originalSize,
    compressedSize: compressedBuffer.length,
    compressionPercentage: 100 - (compressedBuffer.length / originalSize) * 100,
    originalFormat: file.mimetype,
    compressedFormat: `image/${outputFormat}`,
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
    await deleteFromCloudinary(image.images.compressedImage.publicId);
  }

  await image.deleteOne();
  return true;
};
