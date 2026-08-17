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
        if (image.cloudinaryPublicId) {
          try {
            await cloudinary.uploader.destroy(image.cloudinaryPublicId);
          } catch (err) {
            console.error(
              `Falied to delete Clodinary image: ${image.cloudinaryPublicId} - ${image.id}`,
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
