import { Types } from "mongoose";
import { Order } from "../../orders/models/order.model";
import { Payment } from "../../payments/models/payment.model";
import { MenuItem } from "../../menu/models/menu-item.model";
import { Customer } from "../../customers/models/customer.model";

export class AnalyticsRepository {
  async getOrderStatistics(
    restaurantId: string,
    branchId?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const filter: Record<string, unknown> = {
      restaurantId: new Types.ObjectId(restaurantId),
    };

    if (branchId) {
      filter.branchId = new Types.ObjectId(branchId);
    }

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        (filter.createdAt as Record<string, Date>).$gte =
          startDate;
      }

      if (endDate) {
        (filter.createdAt as Record<string, Date>).$lte =
          endDate;
      }
    }

    const result = await Order.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },

          totalRevenue: {
            $sum: {
              $ifNull: ["$grandTotal", 0],
            },
          },

          averageOrderValue: {
            $avg: {
              $ifNull: ["$grandTotal", 0],
            },
          },
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

  async getOrderStatusStatistics(
    restaurantId: string,
    branchId?: string
  ) {
    const match: Record<string, unknown> = {
      restaurantId: new Types.ObjectId(restaurantId),
    };

    if (branchId) {
      match.branchId = new Types.ObjectId(branchId);
    }

    return Order.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);
  }

  async getDailyRevenue(
    restaurantId: string,
    branchId: string | undefined,
    startDate: Date,
    endDate: Date
  ) {
    const match: Record<string, unknown> = {
      restaurantId: new Types.ObjectId(restaurantId),
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (branchId) {
      match.branchId = new Types.ObjectId(branchId);
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

          revenue: {
            $sum: {
              $ifNull: ["$grandTotal", 0],
            },
          },

          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
  }

  async getTopMenuItems(
    restaurantId: string,
    branchId?: string,
    limit = 10
  ) {
    const match: Record<string, unknown> = {
      restaurantId: new Types.ObjectId(restaurantId),
    };

    if (branchId) {
      match.branchId = new Types.ObjectId(branchId);
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
                {
                  $ifNull: ["$items.unitPrice", 0],
                },
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
        $limit: limit,
      },
    ]);
  }

  async getPaymentStatistics(
    restaurantId: string,
    branchId?: string
  ) {
    const match: Record<string, unknown> = {
      restaurantId: new Types.ObjectId(restaurantId),
    };

    if (branchId) {
      match.branchId = new Types.ObjectId(branchId);
    }

    return Payment.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          amount: {
            $sum: {
              $ifNull: ["$amount", 0],
            },
          },
        },
      },
    ]);
  }

  async getCustomerStatistics(
    restaurantId: string,
    branchId?: string
  ) {
    const match: Record<string, unknown> = {
      restaurantId: new Types.ObjectId(restaurantId),
    };

    if (branchId) {
      match.branchId = new Types.ObjectId(branchId);
    }

    const [totalCustomers, activeCustomers] =
      await Promise.all([
        Customer.countDocuments(match),

        Customer.countDocuments({
          ...match,
          isActive: true,
          isDeleted: false,
        }),
      ]);

    return {
      totalCustomers,
      activeCustomers,
    };
  }

  async getMenuStatistics(
    restaurantId: string,
    branchId?: string
  ) {
    const match: Record<string, unknown> = {
      restaurantId: new Types.ObjectId(restaurantId),
      isDeleted: false,
    };

    if (branchId) {
      match.branchId = new Types.ObjectId(branchId);
    }

    const [
      totalItems,
      availableItems,
      unavailableItems,
    ] = await Promise.all([
      MenuItem.countDocuments(match),

      MenuItem.countDocuments({
        ...match,
        isAvailable: true,
        isActive: true,
      }),

      MenuItem.countDocuments({
        ...match,
        isAvailable: false,
      }),
    ]);

    return {
      totalItems,
      availableItems,
      unavailableItems,
    };
  }
}