import { Worker } from "bullmq";

import {
  redisConnection,
} from "../redis.connection";

import {
  QUEUE_NAMES,
  JOB_NAMES,
} from "../queue.constants";

import { Notification } from "../../modules/notifications/models/notification.model";

export const notificationWorker =
  new Worker(
    QUEUE_NAMES.NOTIFICATIONS,
    async (job) => {
      if (
        job.name !==
        JOB_NAMES.SEND_NOTIFICATION
      ) {
        return;
      }

      const notification =
        await Notification.findById(
          job.data.notificationId
        );

      if (!notification) {
        throw new Error(
          "Notification not found."
        );
      }

      notification.isSent = true;
      notification.sentAt = new Date();

      await notification.save();

      console.log(
        `Notification processed: ${notification._id}`
      );
    },
    {
      connection: redisConnection,
    }
  );

notificationWorker.on(
  "completed",
  (job) => {
    console.log(
      `Notification job completed: ${job.id}`
    );
  }
);

notificationWorker.on(
  "failed",
  (job, error) => {
    console.error(
      `Notification job failed: ${job?.id}`,
      error
    );
  }
);