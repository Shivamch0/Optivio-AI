import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  analyzeKeyword,
  deleteKeyword,
  getKeywords,
} from "../controller/keyword.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/").get(getKeywords).post(analyzeKeyword);
router.route("/:keywordId").delete(deleteKeyword);

export default router;
