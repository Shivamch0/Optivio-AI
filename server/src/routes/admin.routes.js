import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/security.middleware.js";
import { getAdminOverview } from "../controller/admin.controller.js";

const router = express.Router();

router.use(verifyJWT, requireRole("admin"));

router.route("/overview").get(getAdminOverview);

export default router;
