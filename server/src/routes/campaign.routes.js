import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  exportCampaignPdf,
  generateCampaign,
  getCampaign,
  getCampaigns,
  regenerateCampaign,
  updateCampaignFavorites,
} from "../controller/campaign.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/").get(getCampaigns);
router.route("/generate").post(generateCampaign);
router.route("/:campaignId").get(getCampaign);
router.route("/:campaignId/regenerate").post(regenerateCampaign);
router.route("/:campaignId/favorites").patch(updateCampaignFavorites);
router.route("/:campaignId/export").get(exportCampaignPdf);

export default router;
