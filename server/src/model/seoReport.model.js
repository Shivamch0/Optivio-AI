import mongoose, { Schema } from "mongoose";

const seoReportSchema = new Schema(
  {
    website: {
      type: Schema.Types.ObjectId,
      ref: "Website",
      required: true,
    },

    analyzedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seoScore: {
      type: Number,
      default: 0,
    },

    titleTag: {
      type: String,
      trim: true,
    },

    metaDescription: {
      type: String,
      trim: true,
    },

    h1TagsCount: {
      type: Number,
      default: 0,
    },

    imageAltCoverage: {
      type: Number,
      default: 0,
    },

    pageSpeedScore: {
      type: Number,
      default: 0,
    },

    mobileFriendly: {
      type: Boolean,
      default: false,
    },

    sslEnabled: {
      type: Boolean,
      default: false,
    },

    brokenLinksCount: {
      type: Number,
      default: 0,
    },

    internalLinksCount: {
      type: Number,
      default: 0,
    },

    externalLinksCount: {
      type: Number,
      default: 0,
    },

    keywordDensity: [
      {
        keyword: {
          type: String,
          trim: true,
        },

        density: {
          type: Number,
        },
      },
    ],

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

        solution: {
          type: String,
        },
      },
    ],

    aiRecommendations: [
      {
        type: String,
      },
    ],

    performanceMetrics: {
      firstContentfulPaint: {
        type: Number,
        default: 0,
      },

      largestContentfulPaint: {
        type: Number,
        default: 0,
      },

      cumulativeLayoutShift: {
        type: Number,
        default: 0,
      },
    },

    reportStatus: {
      type: String,
      enum: ["completed", "pending", "failed"],
      default: "completed",
    },

    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const SEOReport = mongoose.model("SEOReport", seoReportSchema);
