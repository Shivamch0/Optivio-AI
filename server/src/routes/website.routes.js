import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createWebsite,
  deleteWebsite,
  exportSeoReport,
  getCompetitorAnalysis,
  getSeoReports,
  getWebsites,
  runSeoAudit,
  updateWebsite,
} from "../controller/website.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/").get(getWebsites).post(createWebsite);
router.route("/:websiteId").patch(updateWebsite).delete(deleteWebsite);
router.route("/:websiteId/audits").get(getSeoReports).post(runSeoAudit);
router.route("/:websiteId/competitors").get(getCompetitorAnalysis);
router.route("/:websiteId/export").get(exportSeoReport);

export default router;
