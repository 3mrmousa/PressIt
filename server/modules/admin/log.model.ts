import mongoose, { Document, Schema } from "mongoose";

export interface ISystemLog extends Document {
  level: "info" | "warning" | "error";
  message: string;
  meta?: any;
  createdAt: Date;
}

const systemLogSchema = new Schema<ISystemLog>(
  {
    level: {
      type: String,
      enum: ["info", "warning", "error"],
      default: "info",
    },
    message: { type: String, required: true },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const SystemLog = mongoose.model<ISystemLog>("SystemLog", systemLogSchema);

export default SystemLog;
