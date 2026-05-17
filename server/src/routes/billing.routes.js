import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createCheckout,
  getBillingHistory,
} from "../controller/billing.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/checkout").post(createCheckout);
router.route("/history").get(getBillingHistory);

export default router;
