import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Team } from "../model/team.model.js";

const getTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find({
    $or: [{ owner: req.user._id }, { "members.email": req.user.email }],
  })
    .sort({ updatedAt: -1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, teams, "Teams fetched successfully"));
});

const createTeam = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name?.trim()) {
    throw new ApiError(400, "Team name is required");
  }

  const team = await Team.create({
    name: name.trim(),
    owner: req.user._id,
    members: [
      {
        user: req.user._id,
        email: req.user.email,
        role: "owner",
        status: "active",
      },
    ],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, team, "Team created successfully"));
});

const inviteMember = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const { email, role = "member" } = req.body;

  if (!email?.trim()) {
    throw new ApiError(400, "Email is required");
  }

  const team = await Team.findOne({ _id: teamId, owner: req.user._id });

  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingMember = team.members.find((member) => member.email === normalizedEmail);

  if (existingMember) {
    existingMember.role = role;
    existingMember.status = existingMember.status || "invited";
  } else {
    team.members.push({ email: normalizedEmail, role, status: "invited" });
  }

  await team.save();

  return res
    .status(200)
    .json(new ApiResponse(200, team, "Team member invited"));
});

const removeMember = asyncHandler(async (req, res) => {
  const { teamId, email } = req.params;
  const team = await Team.findOne({ _id: teamId, owner: req.user._id });

  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  team.members = team.members.filter((member) => member.email !== email.toLowerCase());
  await team.save();

  return res
    .status(200)
    .json(new ApiResponse(200, team, "Team member removed"));
});

export { createTeam, getTeams, inviteMember, removeMember };
