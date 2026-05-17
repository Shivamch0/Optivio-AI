import express from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js'; 
import { registerUser , loginUser , logoutUser , getCurrentUser , refreshAccessToken , changeCurrentPassword , updateAccountDetails, requestPasswordReset, resetPassword, googleAuth, getSsoLogin } from "../controller/user.controller.js";

const router = express.Router();

router.route('/register').post(registerUser)

router.route("/login").post(loginUser)

router.route("/forgot-password").post(requestPasswordReset);

router.route("/reset-password").post(resetPassword);

router.route("/oauth/google").post(googleAuth);

router.route("/sso/login").get(getSsoLogin);

// secured Routes
router.route("/logout").post(verifyJWT , logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/current-user").get(verifyJWT , getCurrentUser);

router.route("/change-password").patch(verifyJWT , changeCurrentPassword);

router.route("/update-details").patch(verifyJWT , updateAccountDetails);

export default router
