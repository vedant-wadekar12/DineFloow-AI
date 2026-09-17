import {
  addReportJob,
} from "../queues";

export const scheduleDailyReport =
  async (
    restaurantId: string
  ) => {
    const now = new Date();

    const startDate = new Date(
      now.getTime() -
        24 * 60 * 60 * 1000
    );

    await addReportJob({
      restaurantId,
      startDate:
        startDate.toISOString(),
      endDate:
        now.toISOString(),
    });
  };