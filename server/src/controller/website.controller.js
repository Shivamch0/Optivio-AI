import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Website } from "../model/website.model.js";
import { SEOReport } from "../model/seoReport.model.js";
import { User } from "../model/user.model.js";

const normalizeDomain = (domain) => {
  const value = domain?.trim().toLowerCase();

  if (!value) return "";

  try {
    const url = value.startsWith("http") ? new URL(value) : new URL(`https://${value}`);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return value.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
};

const createMockAudit = (domain) => {
  const seed = domain.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  const seoScore = 62 + (seed % 28);
  const pageSpeedScore = 58 + (seed % 34);
  const imageAltCoverage = 48 + (seed % 42);
  const brokenLinksCount = seed % 9;

  return {
    seoScore,
    pageSpeedScore,
    imageAltCoverage,
    brokenLinksCount,
    h1TagsCount: 1 + (seed % 3),
    internalLinksCount: 18 + (seed % 40),
    externalLinksCount: 4 + (seed % 12),
    mobileFriendly: seoScore > 70,
    sslEnabled: true,
    titleTag: `${domain} SEO overview`,
    metaDescription: `Mock audit summary for ${domain}`,
    keywordDensity: [
      { keyword: "seo", density: 2.4 },
      { keyword: "marketing", density: 1.8 },
      { keyword: "analytics", density: 1.3 },
    ],
    technicalIssues: [
      {
        issue: "Some images are missing descriptive alt text",
        severity: imageAltCoverage > 75 ? "low" : "medium",
        solution: "Add concise, keyword-aware alt text to priority images.",
      },
      {
        issue: "Meta descriptions can be improved on key pages",
        severity: seoScore > 80 ? "low" : "medium",
        solution: "Write unique descriptions under 160 characters.",
      },
      {
        issue: "Page speed has room for optimization",
        severity: pageSpeedScore > 75 ? "low" : "high",
        solution: "Compress images, defer scripts, and cache static assets.",
      },
    ],
    aiRecommendations: [
      "Prioritize pages that already rank on page two.",
      "Group related keywords into focused landing page clusters.",
      "Improve internal links from high-authority pages to conversion pages.",
    ],
    performanceMetrics: {
      firstContentfulPaint: 1.1 + (seed % 7) / 10,
      largestContentfulPaint: 2.2 + (seed % 9) / 10,
      cumulativeLayoutShift: Number(`0.0${seed % 8}`),
    },
  };
};

const getWebsites = asyncHandler(async (req, res) => {
  const websites = await Website.find({ user: req.user._id })
    .sort({ updatedAt: -1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, websites, "Websites fetched successfully"));
});

const createWebsite = asyncHandler(async (req, res) => {
  const { websiteName, domain, description, category } = req.body;
  const normalizedDomain = normalizeDomain(domain);

  if (!websiteName?.trim() || !normalizedDomain) {
    throw new ApiError(400, "Website name and domain are required");
  }

  const existingWebsite = await Website.findOne({
    user: req.user._id,
    domain: normalizedDomain,
  });

  if (existingWebsite) {
    throw new ApiError(409, "This website is already in your workspace");
  }

  const website = await Website.create({
    user: req.user._id,
    websiteName: websiteName.trim(),
    domain: normalizedDomain,
    description: description?.trim() || "",
    category: category?.trim() || "",
  });

  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { websites: website._id },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, website, "Website created successfully"));
});

const runSeoAudit = asyncHandler(async (req, res) => {
  const { websiteId } = req.params;
  const website = await Website.findOne({ _id: websiteId, user: req.user._id });

  if (!website) {
    throw new ApiError(404, "Website not found");
  }

  const audit = createMockAudit(website.domain);

  const report = await SEOReport.create({
    website: website._id,
    analyzedBy: req.user._id,
    ...audit,
    reportStatus: "completed",
  });

  website.seoScore = audit.seoScore;
  website.pageSpeed = audit.pageSpeedScore;
  website.mobileOptimizationScore = audit.mobileFriendly ? 92 : 68;
  website.domainAuthority = 30 + (audit.seoScore % 45);
  website.backlinks = 120 + audit.internalLinksCount * 8;
  website.organicTraffic = 2500 + audit.seoScore * 120;
  website.keywordsRanked = 80 + audit.externalLinksCount * 12;
  website.technicalIssues = audit.technicalIssues.map(({ issue, severity }) => ({
    issue,
    severity,
  }));
  website.aiRecommendations = audit.aiRecommendations;
  website.lastAnalyzed = new Date();

  await website.save();

  return res.status(201).json(
    new ApiResponse(
      201,
      { website, report },
      "SEO audit completed successfully",
    ),
  );
});

const getSeoReports = asyncHandler(async (req, res) => {
  const { websiteId } = req.params;
  const website = await Website.findOne({ _id: websiteId, user: req.user._id });

  if (!website) {
    throw new ApiError(404, "Website not found");
  }

  const reports = await SEOReport.find({
    website: website._id,
    analyzedBy: req.user._id,
  })
    .sort({ analyzedAt: -1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, reports, "SEO reports fetched successfully"));
});

export { getWebsites, createWebsite, runSeoAudit, getSeoReports };
