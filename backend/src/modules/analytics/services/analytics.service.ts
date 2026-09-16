import { AnalyticsRepository } from "../repositories/analytics.repository";

export class AnalyticsService {
  constructor(
    private readonly repository = new AnalyticsRepository()
  ) {}

  async getOrderStatistics(
    restaurantId: string,
    branchId?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    return this.repository.getOrderStatistics(
      restaurantId,
      branchId,
      startDate,
      endDate
    );
  }

  async getOrderStatusStatistics(
    restaurantId: string,
    branchId?: string
  ) {
    return this.repository.getOrderStatusStatistics(
      restaurantId,
      branchId
    );
  }

  async getDailyRevenue(
    restaurantId: string,
    branchId: string | undefined,
    startDate: Date,
    endDate: Date
  ) {
    return this.repository.getDailyRevenue(
      restaurantId,
      branchId,
      startDate,
      endDate
    );
  }

  async getTopMenuItems(
    restaurantId: string,
    branchId?: string,
    limit = 10
  ) {
    return this.repository.getTopMenuItems(
      restaurantId,
      branchId,
      limit
    );
  }

  async getPaymentStatistics(
    restaurantId: string,
    branchId?: string
  ) {
    return this.repository.getPaymentStatistics(
      restaurantId,
      branchId
    );
  }

  async getCustomerStatistics(
    restaurantId: string,
    branchId?: string
  ) {
    return this.repository.getCustomerStatistics(
      restaurantId,
      branchId
    );
  }

  async getMenuStatistics(
    restaurantId: string,
    branchId?: string
  ) {
    return this.repository.getMenuStatistics(
      restaurantId,
      branchId
    );
  }

  async getDashboard(
    restaurantId: string,
    branchId?: string
  ) {
    const [
      orders,
      orderStatuses,
      payments,
      customers,
      menu,
      topItems,
    ] = await Promise.all([
      this.getOrderStatistics(
        restaurantId,
        branchId
      ),

      this.getOrderStatusStatistics(
        restaurantId,
        branchId
      ),

      this.getPaymentStatistics(
        restaurantId,
        branchId
      ),

      this.getCustomerStatistics(
        restaurantId,
        branchId
      ),

      this.getMenuStatistics(
        restaurantId,
        branchId
      ),

      this.getTopMenuItems(
        restaurantId,
        branchId
      ),
    ]);

    return {
      orders,
      orderStatuses,
      payments,
      customers,
      menu,
      topItems,
    };
  }
}