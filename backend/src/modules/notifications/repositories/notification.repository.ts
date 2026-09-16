import { Types } from "mongoose";
import {
  INotification,
  Notification,
} from "../models/notification.model";

export class NotificationRepository {
  async create(
    data: Partial<INotification>
  ): Promise<INotification> {
    return Notification.create(data);
  }

  async findById(
    notificationId: string
  ): Promise<INotification | null> {
    return Notification.findById(notificationId);
  }

  async findByRecipient(
    recipientId: string,
    options?: {
      page?: number;
      limit?: number;
      unreadOnly?: boolean;
    }
  ) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      recipientId: new Types.ObjectId(recipientId),
    };

    if (options?.unreadOnly) {
      filter.isRead = false;
    }

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Notification.countDocuments(filter),
    ]);

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async countUnread(recipientId: string): Promise<number> {
    return Notification.countDocuments({
      recipientId: new Types.ObjectId(recipientId),
      isRead: false,
    });
  }

  async markAsRead(
    notificationId: string
  ): Promise<INotification | null> {
    return Notification.findByIdAndUpdate(
      notificationId,
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      },
      {
        new: true,
      }
    );
  }

  async markAllAsRead(
    recipientId: string
  ): Promise<void> {
    await Notification.updateMany(
      {
        recipientId: new Types.ObjectId(recipientId),
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );
  }

  async delete(
    notificationId: string
  ): Promise<boolean> {
    const result = await Notification.deleteOne({
      _id: notificationId,
    });

    return result.deletedCount > 0;
  }

  async deleteAllForRecipient(
    recipientId: string
  ): Promise<void> {
    await Notification.deleteMany({
      recipientId: new Types.ObjectId(recipientId),
    });
  }
}