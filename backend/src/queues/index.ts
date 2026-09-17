export {
  redisConnection,
} from "./redis.connection";

export {
  notificationQueue,
  emailQueue,
  reportQueue,
  aiQueue,
  addNotificationJob,
  addEmailJob,
  addReportJob,
  addAIRecommendationJob,
} from "./queue.manager";

export {
  QUEUE_NAMES,
  JOB_NAMES,
} from "./queue.constants";

export type {
  NotificationJobData,
  EmailJobData,
  ReportJobData,
  AIRecommendationJobData,
} from "./queue.types";