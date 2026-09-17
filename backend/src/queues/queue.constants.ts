export const QUEUE_NAMES = {
  NOTIFICATIONS: "notifications",
  EMAILS: "emails",
  REPORTS: "reports",
  AI: "ai",
} as const;

export const JOB_NAMES = {
  SEND_NOTIFICATION: "send-notification",
  SEND_EMAIL: "send-email",
  GENERATE_REPORT: "generate-report",
  GENERATE_RECOMMENDATIONS:
    "generate-recommendations",
} as const;