import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Campaign } from "../model/campaign.model.js";
import { generateAdCopy } from "../services/adCopy.service.js";
import { createSimplePdf } from "../services/pdf.service.js";

const allowedPlatforms = ["Google Ads", "Instagram", "Facebook", "LinkedIn", "YouTube"];

const normalizeCampaignInput = (body) => {
  const platforms = Array.isArray(body.platforms)
    ? body.platforms.filter((platform) => allowedPlatforms.includes(platform))
    : [];

  return {
    campaignName: body.campaignName?.trim(),
    platforms,
    businessName: body.businessName?.trim(),
    industry: body.industry?.trim(),
    productDescription: body.productDescription?.trim(),
    audience: body.audience?.trim(),
    goal: body.goal,
    tone: body.tone,
  };
};

const validateCampaignInput = (input) => {
  const missing = [
    ["Campaign name", input.campaignName],
    ["Business name", input.businessName],
    ["Industry", input.industry],
    ["Product description", input.productDescription],
    ["Target audience", input.audience],
    ["Marketing goal", input.goal],
    ["Brand tone", input.tone],
  ].filter(([, value]) => !value);

  if (missing.length) {
    throw new ApiError(400, `${missing[0][0]} is required.`);
  }

  if (!input.platforms.length) {
    throw new ApiError(400, "Select at least one platform.");
  }
};

const getCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, campaigns, "Campaigns fetched successfully"));
});

const getCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findOne({
    _id: req.params.campaignId,
    user: req.user._id,
  }).lean();

  if (!campaign) {
    throw new ApiError(404, "Campaign not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, campaign, "Campaign fetched successfully"));
});

const generateCampaign = asyncHandler(async (req, res) => {
  const input = normalizeCampaignInput(req.body);
  validateCampaignInput(input);

  const generated = await generateAdCopy(input);
  const campaign = await Campaign.create({
    user: req.user._id,
    ...input,
    generatedContent: {
      platforms: generated.platforms,
    },
    analytics: generated.analytics,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, campaign, "Campaign generated successfully"));
});

const regenerateCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findOne({
    _id: req.params.campaignId,
    user: req.user._id,
  });

  if (!campaign) {
    throw new ApiError(404, "Campaign not found");
  }

  const input = {
    campaignName: campaign.campaignName,
    platforms: campaign.platforms,
    businessName: campaign.businessName,
    industry: campaign.industry,
    productDescription: campaign.productDescription,
    audience: campaign.audience,
    goal: campaign.goal,
    tone: campaign.tone,
    variantSeed: `${Date.now()}-${campaign.updatedAt?.getTime?.() || ""}`,
  };
  const generated = await generateAdCopy(input);

  campaign.generatedContent = { platforms: generated.platforms };
  campaign.analytics = generated.analytics;
  await campaign.save();

  return res
    .status(200)
    .json(new ApiResponse(200, campaign, "Campaign regenerated successfully"));
});

const updateCampaignFavorites = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text?.trim()) {
    throw new ApiError(400, "Favorite text is required");
  }

  const campaign = await Campaign.findOne({
    _id: req.params.campaignId,
    user: req.user._id,
  });

  if (!campaign) {
    throw new ApiError(404, "Campaign not found");
  }

  const value = text.trim();
  campaign.favorites = campaign.favorites.includes(value)
    ? campaign.favorites.filter((item) => item !== value)
    : [...campaign.favorites, value];
  await campaign.save();

  return res
    .status(200)
    .json(new ApiResponse(200, campaign, "Favorites updated successfully"));
});

const exportCampaignPdf = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findOne({
    _id: req.params.campaignId,
    user: req.user._id,
  }).lean();

  if (!campaign) {
    throw new ApiError(404, "Campaign not found");
  }

  const lines = [
    `Business: ${campaign.businessName}`,
    `Audience: ${campaign.audience}`,
    `Goal: ${campaign.goal}`,
    `Tone: ${campaign.tone}`,
    `Predicted CTR: ${campaign.analytics?.predictedCTR || 0}`,
    `Engagement: ${campaign.analytics?.engagementScore || 0}`,
    `Conversion: ${campaign.analytics?.conversionScore || 0}`,
    "",
    ...campaign.generatedContent.platforms.flatMap((platform) => [
      platform.platform,
      `Headlines: ${platform.headlines.slice(0, 4).join(" | ")}`,
      `Descriptions: ${platform.descriptions.slice(0, 2).join(" | ")}`,
      `CTAs: ${platform.ctas.slice(0, 4).join(", ")}`,
      `Keywords: ${platform.keywords.slice(0, 6).join(", ")}`,
    ]),
  ];

  const pdf = createSimplePdf({ title: campaign.campaignName, lines });

  res.setHeader("content-type", "application/pdf");
  res.setHeader(
    "content-disposition",
    `attachment; filename="${campaign.campaignName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-ads.pdf"`,
  );
  return res.status(200).send(pdf);
});

export {
  exportCampaignPdf,
  generateCampaign,
  getCampaign,
  getCampaigns,
  regenerateCampaign,
  updateCampaignFavorites,
};
