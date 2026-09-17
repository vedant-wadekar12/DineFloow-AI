import { ReportsRepository } from "../repositories/reports.repository";

export class ReportsService {
  constructor(
    private readonly repository = new ReportsRepository()
  ) {}

  private parseDates(
    startDate: string,
    endDate: string
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      throw new Error("Invalid report date range.");
    }

    if (start > end) {
      throw new Error(
        "Start date cannot be after end date."
      );
    }

    return {
      start,
      end,
    };
  }

  async getSalesReport(
    restaurantId: string,
    startDate: string,
    endDate: string,
    branchId?: string
  ) {
    const dates = this.parseDates(
      startDate,
      endDate
    );

    return this.repository.getSalesReport(
      restaurantId,
      dates.start,
      dates.end,
      branchId
    );
  }

  async getDailySalesReport(
    restaurantId: string,
    startDate: string,
    endDate: string,
    branchId?: string
  ) {
    const dates = this.parseDates(
      startDate,
      endDate
    );

    return this.repository.getDailySalesReport(
      restaurantId,
      dates.start,
      dates.end,
      branchId
    );
  }

  async getPaymentReport(
    restaurantId: string,
    startDate: string,
    endDate: string,
    branchId?: string
  ) {
    const dates = this.parseDates(
      startDate,
      endDate
    );

    return this.repository.getPaymentReport(
      restaurantId,
      dates.start,
      dates.end,
      branchId
    );
  }

  async getTopItemsReport(
    restaurantId: string,
    startDate: string,
    endDate: string,
    branchId?: string
  ) {
    const dates = this.parseDates(
      startDate,
      endDate
    );

    return this.repository.getTopItemsReport(
      restaurantId,
      dates.start,
      dates.end,
      branchId
    );
  }

  async getOrderStatusReport(
    restaurantId: string,
    startDate: string,
    endDate: string,
    branchId?: string
  ) {
    const dates = this.parseDates(
      startDate,
      endDate
    );

    return this.repository.getOrderStatusReport(
      restaurantId,
      dates.start,
      dates.end,
      branchId
    );
  }

  async getCustomerReport(
    restaurantId: string,
    startDate: string,
    endDate: string,
    branchId?: string
  ) {
    const dates = this.parseDates(
      startDate,
      endDate
    );

    return this.repository.getCustomerReport(
      restaurantId,
      dates.start,
      dates.end,
      branchId
    );
  }

  async getCompleteReport(
    restaurantId: string,
    startDate: string,
    endDate: string,
    branchId?: string
  ) {
    const dates = this.parseDates(
      startDate,
      endDate
    );

    const [
      sales,
      dailySales,
      payments,
      topItems,
      orderStatuses,
      customers,
    ] = await Promise.all([
      this.repository.getSalesReport(
        restaurantId,
        dates.start,
        dates.end,
        branchId
      ),

      this.repository.getDailySalesReport(
        restaurantId,
        dates.start,
        dates.end,
        branchId
      ),

      this.repository.getPaymentReport(
        restaurantId,
        dates.start,
        dates.end,
        branchId
      ),

      this.repository.getTopItemsReport(
        restaurantId,
        dates.start,
        dates.end,
        branchId
      ),

      this.repository.getOrderStatusReport(
        restaurantId,
        dates.start,
        dates.end,
        branchId
      ),

      this.repository.getCustomerReport(
        restaurantId,
        dates.start,
        dates.end,
        branchId
      ),
    ]);

    return {
      period: {
        startDate,
        endDate,
      },
      sales,
      dailySales,
      payments,
      topItems,
      orderStatuses,
      customers,
    };
  }
}