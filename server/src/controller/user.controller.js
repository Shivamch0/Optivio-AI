import jwt from "jsonwebtoken";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../model/user.model.js";
import { sendPasswordResetEmail } from "../services/email.service.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while generating tokens",
    );
  }
};

const sanitizeUser = (user) => {
  const plainUser = user.toObject ? user.toObject() : user;

  delete plainUser.password;
  delete plainUser.refreshToken;

  return plainUser;
};

const createSessionResponse = async (res, userId, statusCode, message) => {
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userId);
  const user = await User.findById(userId).select("-password -refreshToken");

  return res
    .status(statusCode)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        statusCode,
        { user, accessToken, refreshToken },
        message,
      ),
    );
};

const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password, companyName } = req.body;

  if ([userName, email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "Username, email and password are required");
  }

  const existingUser = await User.findOne({
    $or: [{ userName: userName.trim() }, { email: email.trim().toLowerCase() }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  const user = await User.create({
    userName: userName.trim(),
    email: email.trim().toLowerCase(),
    password,
    companyName: companyName?.trim() || "",
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        { user: createdUser, accessToken, refreshToken },
        "User registered successfully",
      ),
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, userName, password } = req.body;

  if ((!email && !userName) || !password) {
    throw new ApiError(400, "Email or username and password are required");
  }

  const loginOptions = [];

  if (email?.trim()) loginOptions.push({ email: email.trim().toLowerCase() });
  if (userName?.trim()) loginOptions.push({ userName: userName.trim() });

  const user = await User.findOne({ $or: loginOptions });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true },
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decodedToken?._id);

  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is expired or used");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed successfully",
      ),
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters long");
  }

  const user = await User.findById(req.user._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old password is incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { userName, email, companyName, avatar, teamName } = req.body;

  if (
    !userName &&
    !email &&
    companyName === undefined &&
    avatar === undefined &&
    teamName === undefined
  ) {
    throw new ApiError(400, "At least one account detail is required");
  }

  const updates = {};

  if (userName?.trim()) updates.userName = userName.trim();
  if (email?.trim()) updates.email = email.trim().toLowerCase();
  if (companyName !== undefined) updates.companyName = companyName.trim();
  if (avatar !== undefined) updates.avatar = avatar.trim();
  if (teamName !== undefined) updates.teamName = teamName.trim();

  if (updates.userName || updates.email) {
    const duplicateUser = await User.findOne({
      _id: { $ne: req.user._id },
      $or: [
        ...(updates.userName ? [{ userName: updates.userName }] : []),
        ...(updates.email ? [{ email: updates.email }] : []),
      ],
    });

    if (duplicateUser) {
      throw new ApiError(409, "Email or username is already in use");
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true },
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        sanitizeUser(user),
        "Account details updated successfully",
      ),
    );
});

const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email?.trim()) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });

  if (user) {
    const plainToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(plainToken)
      .digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 1000 * 60 * 20);
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/forgot-password?token=${plainToken}`;
    const emailResult = await sendPasswordResetEmail({
      to: user.email,
      resetUrl,
      token: plainToken,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          delivered: emailResult.delivered,
          provider: emailResult.provider,
          resetToken: process.env.NODE_ENV === "production" ? undefined : plainToken,
        },
        emailResult.delivered
          ? "Password reset email sent"
          : "Password reset token generated. Configure email provider for delivery.",
      ),
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "If the account exists, reset instructions were generated."));
});

const googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new ApiError(501, "Google login is not configured");
  }

  if (!idToken) {
    throw new ApiError(400, "Google ID token is required");
  }

  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
  );

  if (!response.ok) {
    throw new ApiError(401, "Invalid Google token");
  }

  const profile = await response.json();

  if (profile.aud !== process.env.GOOGLE_CLIENT_ID || !profile.email_verified) {
    throw new ApiError(401, "Google token audience or email verification failed");
  }

  const email = profile.email.toLowerCase();
  let user = await User.findOne({ email });

  if (!user) {
    const baseUserName = (profile.name || email.split("@")[0])
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 20);
    const suffix = Date.now().toString().slice(-5);

    user = await User.create({
      userName: `${baseUserName || "google"}${suffix}`,
      email,
      password: crypto.randomBytes(24).toString("hex"),
      avatar: profile.picture || "",
      companyName: profile.hd || "",
    });
  }

  return createSessionResponse(res, user._id, 200, "Google login successful");
});

const getSsoLogin = asyncHandler(async (req, res) => {
  if (!process.env.SSO_LOGIN_URL) {
    throw new ApiError(501, "SSO login is not configured");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { url: process.env.SSO_LOGIN_URL }, "SSO login URL fetched"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new ApiError(400, "Reset token and new password are required");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters long");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new ApiError(400, "Reset token is invalid or expired");
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  requestPasswordReset,
  resetPassword,
  googleAuth,
  getSsoLogin,
};
