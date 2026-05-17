import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controller/notification.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/").get(getNotifications);
router.route("/read-all").patch(markAllNotificationsRead);
router.route("/:notificationId/read").patch(markNotificationRead);
router.route("/:notificationId").delete(deleteNotification);

export default router;
