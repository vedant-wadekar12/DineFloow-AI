import { Order } from "../../orders/models/order.model";
import { Payment } from "../../payments/models/payment.model";

export class ReportsRepository {
  async getSalesReport(
    restaurantId: string,
    startDate: Date,
    endDate: Date,
    branchId?: string
  ) {
    const match: Record<string, unknown> = {
      restaurantId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (branchId) {
      match.branchId = branchId;
    }

    const result = await Order.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$grandTotal" },
          averageOrderValue: { $avg: "$grandTotal" },
        },
      },
    ]);

    return (
      result[0] ?? {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
      }
    );
  }

  async getDailySalesReport(
    restaurantId: string,
    startDate: Date,
    endDate: Date,
    branchId?: string
  ) {
    const match: Record<string, unknown> = {
      restaurantId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (branchId) {
      match.branchId = branchId;
    }

    return Order.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$grandTotal" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
  }

  async getPaymentReport(
    restaurantId: string,
    startDate: Date,
    endDate: Date,
    branchId?: string
  ) {
    const match: Record<string, unknown> = {
      restaurantId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (branchId) {
      match.branchId = branchId;
    }

    return Payment.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          amount: { $sum: "$amount" },
        },
      },
      {
        $sort: {
          amount: -1,
        },
      },
    ]);
  }

  async getTopItemsReport(
    restaurantId: string,
    startDate: Date,
    endDate: Date,
    branchId?: string
  ) {
    const match: Record<string, unknown> = {
      restaurantId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (branchId) {
      match.branchId = branchId;
    }

    return Order.aggregate([
      {
        $match: match,
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.menuItemId",
          name: {
            $first: "$items.name",
          },
          quantity: {
            $sum: "$items.quantity",
          },
          revenue: {
            $sum: {
              $multiply: [
                "$items.quantity",
                "$items.unitPrice",
              ],
            },
          },
        },
      },
      {
        $sort: {
          quantity: -1,
        },
      },
      {
        $limit: 20,
      },
    ]);
  }

  async getOrderStatusReport(
    restaurantId: string,
    startDate: Date,
    endDate: Date,
    branchId?: string
  ) {
    const match: Record<string, unknown> = {
      restaurantId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (branchId) {
      match.branchId = branchId;
    }

    return Order.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);
  }

  async getCustomerReport(
    restaurantId: string,
    startDate: Date,
    endDate: Date,
    branchId?: string
  ) {
    const match: Record<string, unknown> = {
      restaurantId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (branchId) {
      match.branchId = branchId;
    }

    const result = await Order.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: "$customerId",
          orders: {
            $sum: 1,
          },
          spending: {
            $sum: "$grandTotal",
          },
        },
      },
      {
        $group: {
          _id: null,
          uniqueCustomers: {
            $sum: 1,
          },
          totalCustomerOrders: {
            $sum: "$orders",
          },
          totalCustomerSpending: {
            $sum: "$spending",
          },
        },
      },
    ]);

    return (
      result[0] ?? {
        uniqueCustomers: 0,
        totalCustomerOrders: 0,
        totalCustomerSpending: 0,
      }
    );
  }
}