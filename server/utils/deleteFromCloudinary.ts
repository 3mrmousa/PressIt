import cloudinary from "../config/cloudinary.js";
import AppError from "./errors/AppError.js";


export const deleteFromCloudinary = async (publicId: string) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new AppError("Cloudinary delete failed", 500);
    }
}