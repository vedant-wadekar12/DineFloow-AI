export interface NotificationJobData {
  notificationId: string;
}

export interface EmailJobData {
  to: string;
  subject: string;
  message: string;
}

export interface ReportJobData {
  restaurantId: string;
  startDate: string;
  endDate: string;
  branchId?: string;
}

export interface AIRecommendationJobData {
  restaurantId: string;
  customerId?: string;
}