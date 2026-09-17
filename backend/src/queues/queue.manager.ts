import { Queue } from "bullmq";

import {
  redisConnection,
} from "./redis.connection";

import {
  QUEUE_NAMES,
  JOB_NAMES,
} from "./queue.constants";

import type {
  NotificationJobData,
  EmailJobData,
  ReportJobData,
  AIRecommendationJobData,
} from "./queue.types";

export const notificationQueue =
  new Queue(QUEUE_NAMES.NOTIFICATIONS, {
    connection: redisConnection,
  });

export const emailQueue =
  new Queue(QUEUE_NAMES.EMAILS, {
    connection: redisConnection,
  });

export const reportQueue =
  new Queue(QUEUE_NAMES.REPORTS, {
    connection: redisConnection,
  });

export const aiQueue =
  new Queue(QUEUE_NAMES.AI, {
    connection: redisConnection,
  });

export const addNotificationJob = async (
  data: NotificationJobData
) => {
  return notificationQueue.add(
    JOB_NAMES.SEND_NOTIFICATION,
    data
  );
};

export const addEmailJob = async (
  data: EmailJobData
) => {
  return emailQueue.add(
    JOB_NAMES.SEND_EMAIL,
    data
  );
};

export const addReportJob = async (
  data: ReportJobData
) => {
  return reportQueue.add(
    JOB_NAMES.GENERATE_REPORT,
    data
  );
};

export const addAIRecommendationJob =
  async (
    data: AIRecommendationJobData
  ) => {
    return aiQueue.add(
      JOB_NAMES.GENERATE_RECOMMENDATIONS,
      data
    );
  };