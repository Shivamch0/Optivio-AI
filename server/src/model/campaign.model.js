import mongoose, { Schema } from "mongoose";

const generatedPlatformSchema = new Schema(
  {
    platform: {
      type: String,
      required: true,
      trim: true,
    },
    headlines: [{ type: String, trim: true }],
    descriptions: [{ type: String, trim: true }],
    ctas: [{ type: String, trim: true }],
    keywords: [{ type: String, trim: true }],
    hashtags: [{ type: String, trim: true }],
    captions: [{ type: String, trim: true }],
    videoScripts: [{ type: String, trim: true }],
    emailSubjects: [{ type: String, trim: true }],
    landingPageCopy: [{ type: String, trim: true }],
    abVariations: [
      {
        name: { type: String, trim: true },
        headline: { type: String, trim: true },
        description: { type: String, trim: true },
        cta: { type: String, trim: true },
      },
    ],
    optimizationSuggestions: [{ type: String, trim: true }],
  },
  { _id: false },
);

const campaignSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    campaignName: {
      type: String,
      required: true,
      trim: true,
    },
    platforms: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "Select at least one platform.",
      },
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    productDescription: {
      type: String,
      required: true,
      trim: true,
    },
    audience: {
      type: String,
      required: true,
      trim: true,
    },
    goal: {
      type: String,
      enum: ["sales", "leads", "awareness", "app_installs", "traffic"],
      required: true,
    },
    tone: {
      type: String,
      enum: ["professional", "luxury", "emotional", "funny", "startup", "minimal"],
      required: true,
    },
    generatedContent: {
      platforms: {
        type: [generatedPlatformSchema],
        default: [],
      },
    },
    analytics: {
      predictedCTR: { type: Number, default: 0 },
      engagementScore: { type: Number, default: 0 },
      conversionScore: { type: Number, default: 0 },
    },
    favorites: [{ type: String, trim: true }],
    promptVersion: {
      type: String,
      default: "ad-copy-v1",
    },
  },
  { timestamps: true },
);

campaignSchema.index({ user: 1, createdAt: -1 });

export const Campaign = mongoose.model("Campaign", campaignSchema);
