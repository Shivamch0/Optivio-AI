import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../model/user.model.js";
import { Website } from "../model/website.model.js";
import { SEOReport } from "../model/seoReport.model.js";
import { Keyword } from "../model/keyword.model.js";

const getAdminOverview = asyncHandler(async (req, res) => {
  const [users, websites, reports, keywords, recentUsers] = await Promise.all([
    User.countDocuments(),
    Website.countDocuments(),
    SEOReport.countDocuments(),
    Keyword.countDocuments(),
    User.find().sort({ createdAt: -1 }).limit(10).select("-password -refreshToken").lean(),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      { users, websites, reports, keywords, recentUsers },
      "Admin overview fetched",
    ),
  );
});

export { getAdminOverview };
