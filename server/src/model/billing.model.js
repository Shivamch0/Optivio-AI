import mongoose, { Schema } from "mongoose";

const billingEventSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      enum: ["stripe", "mock"],
      default: "mock",
    },
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
    status: {
      type: String,
      enum: ["created", "active", "cancelled", "failed"],
      default: "created",
    },
    checkoutUrl: {
      type: String,
      default: "",
    },
    providerSessionId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export const BillingEvent = mongoose.model("BillingEvent", billingEventSchema);
