import cron from "node-cron";
import Compress from "../modules/compress/compress.model.js";
import cloudinary from "../config/cloudinary.js";

export const startCleanupJob = () => {

  cron.schedule("0 * * * *", async () => {
    console.log("🧹 Running guest image cleanup job...");
    try {
      const oneHourAgo = new Date(Date.now() - 120 * 60 * 1000);

      const expiredImages = await Compress.find({
        user: null,
        createdAt: { $lt: oneHourAgo },
      });

      if (expiredImages.length === 0) {
        return;
      }

      console.log(
        `🗑️ Found ${expiredImages.length} expired guest images to delete.`,
      );

      for (const image of expiredImages) {
        const publicId = image.images?.compressedImage?.publicId;
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error(
              `Failed to delete Cloudinary image: ${publicId} - ${image.id}`,
            );
          }
        }

        await image.deleteOne();
      }

      console.log(`✅ Cleaned up ${expiredImages.length} expired images.`);
    } catch (error) {
      console.error("❌ Error in cleanup job:", error);
    }
  });
};
