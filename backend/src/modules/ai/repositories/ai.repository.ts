import { Order } from "../../orders/models/order.model";
import { MenuItem } from "../../menu/models/menu-item.model";

export class AIRepository {
  async getPopularItems(
    restaurantId: string,
    limit = 10
  ) {
    return Order.aggregate([
      {
        $match: {
          restaurantId,
        },
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
        $limit: limit,
      },
    ]);
  }

  async getCustomerOrderedItems(
    restaurantId: string,
    customerId: string
  ) {
    return Order.aggregate([
      {
        $match: {
          restaurantId,
          customerId,
        },
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
        },
      },
      {
        $sort: {
          quantity: -1,
        },
      },
    ]);
  }

  async getAvailableMenuItems(
    restaurantId: string,
    limit = 50
  ) {
    return MenuItem.find({
      restaurantId,
      isActive: true,
      isAvailable: true,
    })
      .limit(limit)
      .lean();
  }

  async findMenuItemById(
    restaurantId: string,
    menuItemId: string
  ) {
    return MenuItem.findOne({
      _id: menuItemId,
      restaurantId,
      isActive: true,
    }).lean();
  }
}