import mongoose, { Schema } from "mongoose";

const keywordSchema = new Schema(
  {
    website: {
      type: Schema.Types.ObjectId,
      ref: "Website",
      required: true,
    },

    keyword: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    searchVolume: {
      type: Number,
      default: 0,
    },

    keywordDifficulty: {
      type: Number,
      default: 0,
    },

    cpc: {
      type: Number,
      default: 0,
    },

    competitionLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    rankingPosition: {
      type: Number,
      default: 0,
    },

    previousRankingPosition: {
      type: Number,
      default: 0,
    },

    rankingChange: {
      type: Number,
      default: 0,
    },

    clicks: {
      type: Number,
      default: 0,
    },

    impressions: {
      type: Number,
      default: 0,
    },

    ctr: {
      type: Number,
      default: 0,
    },

    searchIntent: {
      type: String,
      enum: ["informational", "navigational", "transactional", "commercial"],
      default: "informational",
    },

    trend: {
      type: String,
      enum: ["up", "down", "stable"],
      default: "stable",
    },

    country: {
      type: String,
      default: "global",
    },

    language: {
      type: String,
      default: "english",
    },

    relatedKeywords: [
      {
        type: String,
      },
    ],

    aiSuggestion: {
      type: String,
    },

    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const Keyword = mongoose.model("Keyword", keywordSchema);
