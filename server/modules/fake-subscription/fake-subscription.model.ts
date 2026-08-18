import mongoose from "mongoose";

const fakeSubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    plan: {
      type: String,
      enum: ["plus", "pro"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "canceled", "past_due", "paused"],
      default: "active",
      required: true,
    },
    fakeSubscriptionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currentPeriodStart: {
      type: Date,
      required: true,
    },
    currentPeriodEnd: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const FakeSubscription = mongoose.model(
  "FakeSubscription",
  fakeSubscriptionSchema,
);

export default FakeSubscription;
