import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    compressedImage: {
      secureUrl: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
  },
  { _id: false },
);

const compressModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    imageName: {
      type: String,
      required: true,
    },
    originalSize: {
      type: Number,
      required: true,
    },
    compressedSize: {
      type: Number,
      required: true,
    },
    compressionPercentage: {
      type: Number,
      required: true,
    },
    originalFormat: {
      type: String,
      required: false,
    },
    compressedFormat: {
      type: String,
      required: false,
    },
    images: { type: imageSchema, default: {} },
  },
  { timestamps: true },
);

compressModel.index({ user: 1, createdAt: -1 });

const Compress = mongoose.model("Compress", compressModel);

export default Compress;
