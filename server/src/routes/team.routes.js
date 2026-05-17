import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createTeam,
  getTeams,
  inviteMember,
  removeMember,
} from "../controller/team.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/").get(getTeams).post(createTeam);
router.route("/:teamId/invite").post(inviteMember);
router.route("/:teamId/members/:email").delete(removeMember);

export default router;
