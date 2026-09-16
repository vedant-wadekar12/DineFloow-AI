import {
  BadRequestError,
  NotFoundError,
} from "../../../common/errors";
import { NotificationRepository } from "../repositories/notification.repository";

export class NotificationService {
  constructor(
    private readonly repository = new NotificationRepository()
  ) {}

  async createNotification(data: {
    restaurantId?: string;
    branchId?: string;
    recipientId: string;
    type:
      | "ORDER_CREATED"
      | "ORDER_CONFIRMED"
      | "ORDER_PREPARING"
      | "ORDER_READY"
      | "ORDER_SERVED"
      | "ORDER_CANCELLED"
      | "PAYMENT_SUCCESS"
      | "PAYMENT_FAILED"
      | "LOW_STOCK"
      | "NEW_TASK"
      | "TASK_COMPLETED"
      | "LOYALTY"
      | "SUBSCRIPTION"
      | "SYSTEM";
    channel?: "IN_APP" | "EMAIL" | "SMS" | "PUSH";
    title: string;
    message: string;
    data?: Record<string, unknown>;
    referenceType?: string;
    referenceId?: string;
  }) {
    return this.repository.create({
      restaurantId: data.restaurantId as never,
      branchId: data.branchId as never,
      recipientId: data.recipientId as never,
      type: data.type,
      channel: data.channel ?? "IN_APP",
      title: data.title,
      message: data.message,
      data: data.data,
      referenceType: data.referenceType,
      referenceId: data.referenceId as never,
      isRead: false,
      isSent: data.channel === "IN_APP",
      sentAt:
        data.channel === "IN_APP"
          ? new Date()
          : undefined,
    });
  }

  async getMyNotifications(
    userId: string,
    options?: {
      page?: number;
      limit?: number;
      unreadOnly?: boolean;
    }
  ) {
    return this.repository.findByRecipient(userId, options);
  }

  async getUnreadCount(userId: string) {
    return this.repository.countUnread(userId);
  }

  async markAsRead(
    notificationId: string,
    userId: string
  ) {
    const notification =
      await this.repository.findById(notificationId);

    if (!notification) {
      throw new NotFoundError("Notification not found.");
    }

    if (notification.recipientId.toString() !== userId) {
      throw new BadRequestError(
        "You cannot update another user's notification."
      );
    }

    return this.repository.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string) {
    await this.repository.markAllAsRead(userId);

    return {
      message: "All notifications marked as read.",
    };
  }

  async delete(
    notificationId: string,
    userId: string
  ) {
    const notification =
      await this.repository.findById(notificationId);

    if (!notification) {
      throw new NotFoundError("Notification not found.");
    }

    if (notification.recipientId.toString() !== userId) {
      throw new BadRequestError(
        "You cannot delete another user's notification."
      );
    }

    await this.repository.delete(notificationId);

    return {
      message: "Notification deleted successfully.",
    };
  }
}