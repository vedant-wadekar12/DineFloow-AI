import { Router } from "express";
import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";
import { NotificationController } from "../controllers/notification.controller";

const router = Router();

const controller = new NotificationController();

router.use(authenticate);

router.post(
  "/",
  authorizePermissions("notification:create"),
  controller.create
);

router.get(
  "/",
  authorizePermissions("notification:read"),
  controller.getMyNotifications
);

router.get(
  "/unread-count",
  authorizePermissions("notification:read"),
  controller.getUnreadCount
);

router.patch(
  "/:notificationId/read",
  authorizePermissions("notification:update"),
  controller.markAsRead
);

router.patch(
  "/read-all",
  authorizePermissions("notification:update"),
  controller.markAllAsRead
);

router.delete(
  "/:notificationId",
  authorizePermissions("notification:delete"),
  controller.delete
);

export default router;