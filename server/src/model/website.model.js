import mongoose, { Schema } from "mongoose";

const websiteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    websiteName: {
      type: String,
      required: true,
      trim: true,
    },

    domain: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
    },

    seoScore: {
      type: Number,
      default: 0,
    },

    domainAuthority: {
      type: Number,
      default: 0,
    },

    pageSpeed: {
      type: Number,
      default: 0,
    },

    mobileOptimizationScore: {
      type: Number,
      default: 0,
    },

    backlinks: {
      type: Number,
      default: 0,
    },

    organicTraffic: {
      type: Number,
      default: 0,
    },

    keywordsRanked: {
      type: Number,
      default: 0,
    },

    technicalIssues: [
      {
        issue: {
          type: String,
        },

        severity: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "low",
        },
      },
    ],

    aiRecommendations: [
      {
        type: String,
      },
    ],

    competitorWebsites: [
      {
        type: String,
        trim: true,
      },
    ],

    lastAnalyzed: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

websiteSchema.index({ user: 1, domain: 1 }, { unique: true });

export const Website = mongoose.model("Website", websiteSchema);
