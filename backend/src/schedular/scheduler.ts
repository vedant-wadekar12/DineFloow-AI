import { Queue } from "bullmq";

import {
  redisConnection,
} from "../queues/redis.connection";

import {
  QUEUE_NAMES,
  JOB_NAMES,
} from "../queues/queue.constants";

export const schedulerQueue =
  new Queue(
    QUEUE_NAMES.REPORTS,
    {
      connection:
        redisConnection,
    }
  );

export const initializeScheduler =
  async () => {
    await schedulerQueue.upsertJobScheduler(
      "daily-report-scheduler",
      {
        pattern: "0 0 * * *",
      },
      {
        name:
          JOB_NAMES.GENERATE_REPORT,
        data: {
          scheduled: true,
        },
      }
    );

    console.log(
      "Scheduler initialized."
    );
  };