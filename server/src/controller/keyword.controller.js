import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Keyword } from "../model/keyword.model.js";
import { Website } from "../model/website.model.js";
import { Notification } from "../model/notification.model.js";

const seedFrom = (value) =>
  value.split("").reduce((total, char) => total + char.charCodeAt(0), 0);

const buildKeywordMetrics = (keyword, website) => {
  const seed = seedFrom(`${keyword}-${website.domain}`);
  const rankingPosition = 1 + (seed % 80);
  const previousRankingPosition = Math.min(100, rankingPosition + ((seed % 13) - 6));

  return {
    searchVolume: 500 + (seed % 18000),
    keywordDifficulty: 18 + (seed % 72),
    cpc: Number((0.45 + (seed % 800) / 100).toFixed(2)),
    competitionLevel: seed % 3 === 0 ? "low" : seed % 3 === 1 ? "medium" : "high",
    rankingPosition,
    previousRankingPosition,
    rankingChange: previousRankingPosition - rankingPosition,
    clicks: 20 + (seed % 950),
    impressions: 800 + (seed % 24000),
    ctr: Number((1.2 + (seed % 800) / 100).toFixed(2)),
    searchIntent: ["informational", "navigational", "transactional", "commercial"][seed % 4],
    trend: seed % 3 === 0 ? "up" : seed % 3 === 1 ? "stable" : "down",
    relatedKeywords: [
      `${keyword} strategy`,
      `${keyword} tools`,
      `${keyword} tips`,
    ],
    aiSuggestion:
      rankingPosition <= 20
        ? "Improve on-page depth and internal links to push this keyword into higher positions."
        : "Create a focused content page before expecting this keyword to rank.",
  };
};

const buildKeywordSuggestions = (keyword, website) => {
  const base = keyword.trim().toLowerCase();
  const modifiers = [
    "strategy",
    "tools",
    "pricing",
    "examples",
    "checklist",
    "agency",
    "software",
    "audit",
  ];

  return modifiers.map((modifier) => {
    const phrase = `${base} ${modifier}`;
    return {
      keyword: phrase,
      ...buildKeywordMetrics(phrase, website),
    };
  });
};

const assertWebsiteAccess = async (websiteId, userId) => {
  const website = await Website.findOne({ _id: websiteId, user: userId });

  if (!website) {
    throw new ApiError(404, "Website not found");
  }

  return website;
};

const getKeywords = asyncHandler(async (req, res) => {
  const { websiteId } = req.query;

  if (!websiteId) {
    throw new ApiError(400, "Website id is required");
  }

  await assertWebsiteAccess(websiteId, req.user._id);

  const keywords = await Keyword.find({ website: websiteId })
    .sort({ updatedAt: -1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, keywords, "Keywords fetched successfully"));
});

const analyzeKeyword = asyncHandler(async (req, res) => {
  const { websiteId, keyword, country, language } = req.body;

  if (!websiteId || !keyword?.trim()) {
    throw new ApiError(400, "Website id and keyword are required");
  }

  const website = await assertWebsiteAccess(websiteId, req.user._id);
  const normalizedKeyword = keyword.trim().toLowerCase();
  const metrics = buildKeywordMetrics(normalizedKeyword, website);

  const record = await Keyword.findOneAndUpdate(
    { website: website._id, keyword: normalizedKeyword },
    {
      $set: {
        ...metrics,
        country: country?.trim() || "global",
        language: language?.trim() || "english",
        analyzedAt: new Date(),
      },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );

  await Website.findByIdAndUpdate(website._id, {
    $set: {
      keywordsRanked: await Keyword.countDocuments({ website: website._id }),
    },
  });

  await Notification.create({
    user: req.user._id,
    website: website._id,
    title: `Keyword analyzed: ${normalizedKeyword}`,
    message: `Ranking estimate is #${record.rankingPosition} with ${record.searchVolume.toLocaleString()} monthly searches.`,
    type: "ranking_update",
    priority: record.rankingPosition <= 20 ? "medium" : "low",
    metadata: {
      keyword: normalizedKeyword,
      newValue: String(record.rankingPosition),
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, record, "Keyword analyzed successfully"));
});

const deleteKeyword = asyncHandler(async (req, res) => {
  const { keywordId } = req.params;
  const keyword = await Keyword.findById(keywordId);

  if (!keyword) {
    throw new ApiError(404, "Keyword not found");
  }

  await assertWebsiteAccess(keyword.website, req.user._id);
  await keyword.deleteOne();

  await Website.findByIdAndUpdate(keyword.website, {
    $set: {
      keywordsRanked: await Keyword.countDocuments({ website: keyword.website }),
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { keywordId }, "Keyword deleted successfully"));
});

const getKeywordSuggestions = asyncHandler(async (req, res) => {
  const { websiteId, keyword } = req.query;

  if (!websiteId || !keyword?.trim()) {
    throw new ApiError(400, "Website id and keyword are required");
  }

  const website = await assertWebsiteAccess(websiteId, req.user._id);
  const suggestions = buildKeywordSuggestions(keyword, website);

  return res
    .status(200)
    .json(new ApiResponse(200, suggestions, "Keyword suggestions fetched"));
});

export { analyzeKeyword, deleteKeyword, getKeywords, getKeywordSuggestions };
