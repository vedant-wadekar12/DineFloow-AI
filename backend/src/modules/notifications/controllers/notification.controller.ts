import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../common/interfaces";

import {
  createNotificationSchema,
  notificationListSchema,
} from "../validators/notification.validator";
import { NotificationService } from "../services/notification.service";

export class NotificationController {
  constructor(
    private readonly service = new NotificationService()
  ) {}

  create = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = createNotificationSchema.parse(req.body);

      const notification =
        await this.service.createNotification(data);

      res.status(201).json({
        success: true,
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyNotifications = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query = notificationListSchema.parse(req.query);

      const result =
        await this.service.getMyNotifications(
          req.user!.userId,
          query
        );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getUnreadCount = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const count =
        await this.service.getUnreadCount(
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        data: {
          unreadCount: count,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const notificationId =
        String(req.params.notificationId);

      const notification =
        await this.service.markAsRead(
          notificationId,
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  };

  markAllAsRead = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result =
        await this.service.markAllAsRead(
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const notificationId =
        String(req.params.notificationId);

      const result =
        await this.service.delete(
          notificationId,
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}