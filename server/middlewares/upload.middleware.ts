import multer from "multer";
import AppError from "../utils/errors/AppError.js";

const storage = multer.memoryStorage();

const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg", "image/svg+xml"];

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          "Invalid file type only jpg, jpeg, png, webp, svg are allowed",
          400,
        ),
      );
    }
  },
});

export const uploadSingleImageForCompress = upload.single("compress-image");
export const uploadSingleImageForProfile = upload.single("profile-picture");
export const uploadAdminSettingsImages = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "favicon", maxCount: 1 },
]);
