import mongoose, { Document, Schema } from "mongoose";

export interface IAdminSettings extends Document {
  siteName: string;
  logo: {
    secure_url: string;
    public_id: string;
  };
  subscriptionPrices: {
    plus: number;
    pro: number;
  };
}

const adminSettingsSchema = new Schema<IAdminSettings>(
  {
    siteName: { type: String, default: "Sprintlyze" },
    logo: {
      secure_url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    subscriptionPrices: {
      plus: { type: Number, default: 9.99 },
      pro: { type: Number, default: 19.99 },
    },
  },
  { timestamps: true }
);

const AdminSettings = mongoose.model<IAdminSettings>("AdminSettings", adminSettingsSchema);

export default AdminSettings;
