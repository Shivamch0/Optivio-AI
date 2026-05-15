import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    website: {
      type: Schema.Types.ObjectId,
      ref: "Website",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "seo_alert",
        "ranking_update",
        "ai_recommendation",
        "traffic_alert",
        "security_alert",
        "system_notification",
      ],
      default: "system_notification",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    actionLink: {
      type: String,
      default: "",
    },

    metadata: {
      oldValue: {
        type: String,
      },

      newValue: {
        type: String,
      },

      keyword: {
        type: String,
      },
    },

    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const Notification = mongoose.model("Notification", notificationSchema);
