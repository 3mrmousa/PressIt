import express from "express";
import {
  compressImage,
  deleteImage,
  getHistory,
  getImageById,
} from "./compress.controller.js";
import { uploadSingleImageForCompress } from "../../middlewares/upload.middleware.js";
import { checkCompressionLimit } from "../../middlewares/checkCompressionLimit.middelware.js";
import {
  authorizeRoles,
  optionalProtect,
  Protect,
} from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/compress",
  optionalProtect,
  checkCompressionLimit,
  uploadSingleImageForCompress,
  compressImage,
);

router.use(Protect);

router.get("/history", authorizeRoles("user", "admin", "manager"), getHistory);

router.get("/:id", authorizeRoles("user", "admin", "manager"), getImageById);

router.delete("/:id", authorizeRoles("user", "admin", "manager"), deleteImage);

export default router;
