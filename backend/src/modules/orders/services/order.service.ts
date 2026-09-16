import { randomUUID } from "crypto";
import { Types } from "mongoose";

import { NotFoundError } from "../../../common/errors";

import { Cart } from "../../carts/models/cart.model";

import { MenuItem } from "../../menu/models/menu-item.model";
import { MenuVariant } from "../../menu/models/menu-variant.model";
import { MenuAddon } from "../../menu/models/menu-addon.model";

import { orderRepository } from "../repositories/order.repository";

import {
  createOrderSchema,
  updateOrderStatusSchema,
  cancelOrderSchema,
} from "../validators/order.validator";

import {
  IOrder,
  OrderStatus,
} from "../models/order.model";

export class OrderService {
  // ============================================================
  // CREATE ORDER
  // ============================================================

  async create(
    input: unknown,
    userId?: string
  ) {
    const data =
      createOrderSchema.parse(input);

    // ------------------------------------------------------------
    // Find active cart
    // ------------------------------------------------------------

    const cart = await Cart.findOne({
      _id: data.cartId,
      isActive: true,
    });

    if (!cart) {
      throw new NotFoundError(
        "Active cart not found"
      );
    }

    // ------------------------------------------------------------
    // Prevent empty cart order
    // ------------------------------------------------------------

    if (cart.items.length === 0) {
      throw new Error(
        "Cannot create order from empty cart"
      );
    }

    // ============================================================
    // MENU ITEM SNAPSHOT
    // ============================================================

    const menuItemIds = cart.items.map(
      (item) => item.menuItemId
    );

    const menuItems =
      await MenuItem.find({
        _id: {
          $in: menuItemIds,
        },
        isDeleted: false,
      });

    const menuItemMap =
      new Map(
        menuItems.map((item) => [
          item._id.toString(),
          item,
        ])
      );

    // ------------------------------------------------------------
    // Validate menu items
    // ------------------------------------------------------------

    for (const item of cart.items) {
      const menuItem =
        menuItemMap.get(
          item.menuItemId.toString()
        );

      if (!menuItem) {
        throw new NotFoundError(
          "One or more menu items no longer exist"
        );
      }
    }

    // ============================================================
    // VARIANT SNAPSHOT
    // ============================================================

    const variantIds = cart.items
      .map((item) => item.variantId)
      .filter(
        (
          id
        ): id is Types.ObjectId =>
          !!id
      );

    const variants =
      variantIds.length > 0
        ? await MenuVariant.find({
            _id: {
              $in: variantIds,
            },
            isDeleted: false,
          })
        : [];

    const variantMap =
      new Map(
        variants.map((variant) => [
          variant._id.toString(),
          variant,
        ])
      );

    // ============================================================
    // ADDON SNAPSHOT
    // ============================================================

    const addonIds = cart.items
      .flatMap(
        (item) =>
          item.selectedAddons?.map(
            (addon) =>
              addon.addonId
          ) ?? []
      );

    const addons =
      addonIds.length > 0
        ? await MenuAddon.find({
            _id: {
              $in: addonIds,
            },
            isDeleted: false,
          })
        : [];

    const addonMap =
      new Map(
        addons.map((addon) => [
          addon._id.toString(),
          addon,
        ])
      );

    // ============================================================
    // CREATE ORDER ITEM SNAPSHOT
    // ============================================================

    const items = cart.items.map(
      (item) => {
        // --------------------------------------------------------
        // Menu item
        // --------------------------------------------------------

        const menuItem =
          menuItemMap.get(
            item.menuItemId.toString()
          );

        if (!menuItem) {
          throw new NotFoundError(
            "One or more menu items no longer exist"
          );
        }

        // --------------------------------------------------------
        // Variant
        // --------------------------------------------------------

        let variantName:
          | string
          | undefined;

        if (item.variantId) {
          const variant =
            variantMap.get(
              item.variantId.toString()
            );

          if (!variant) {
            throw new NotFoundError(
              "One or more menu variants no longer exist"
            );
          }

          variantName =
            variant.name;
        }

        // --------------------------------------------------------
        // Addons
        // --------------------------------------------------------

        const orderAddons =
          item.selectedAddons?.map(
            (addon) => {
              const menuAddon =
                addonMap.get(
                  addon.addonId.toString()
                );

              if (!menuAddon) {
                throw new NotFoundError(
                  "One or more menu addons no longer exist"
                );
              }

              return {
                addonId:
                  addon.addonId,

                name:
                  menuAddon.name,

                quantity:
                  addon.quantity,

                unitPrice:
                  addon.unitPrice,

                totalPrice:
                  addon.unitPrice *
                  addon.quantity,
              };
            }
          ) ?? [];

        // --------------------------------------------------------
        // Order item snapshot
        // --------------------------------------------------------

        return {
          menuItemId:
            item.menuItemId,

          variantId:
            item.variantId,

          name:
            menuItem.name,

          variantName,

          quantity:
            item.quantity,

          unitPrice:
            item.unitPrice,

          addons:
            orderAddons,

          specialInstructions:
            item.specialInstructions,

          totalPrice:
            item.totalPrice,
        };
      }
    );

    // ============================================================
    // CALCULATE SUBTOTAL
    // ============================================================

    const subtotal =
      items.reduce(
        (sum, item) =>
          sum + item.totalPrice,
        0
      );

    // ============================================================
    // GENERATE ORDER NUMBER
    // ============================================================

    const orderNumber =
      `ORD-${Date.now()}-${randomUUID()
        .slice(0, 6)
        .toUpperCase()}`;

    // ============================================================
    // CREATE ORDER
    // ============================================================

    const order =
      await orderRepository.create({
        restaurantId:
          new Types.ObjectId(
            data.restaurantId
          ),

        branchId: data.branchId
          ? new Types.ObjectId(
              data.branchId
            )
          : cart.branchId,

        customerId: data.customerId
          ? new Types.ObjectId(
              data.customerId
            )
          : cart.customerId,

        tableId: data.tableId
          ? new Types.ObjectId(
              data.tableId
            )
          : cart.tableId,

        cartId:
          new Types.ObjectId(
            data.cartId
          ),

        orderNumber,

        orderType:
          data.orderType,

        status: "PENDING",

        items,

        subtotal,

        discountAmount: 0,

        taxAmount: 0,

        serviceCharge: 0,

        totalAmount:
          subtotal,

        customerNote:
          data.customerNote,

        createdBy: userId
          ? new Types.ObjectId(userId)
          : undefined,

        updatedBy: userId
          ? new Types.ObjectId(userId)
          : undefined,
      });

    // ============================================================
    // DEACTIVATE CART
    // ============================================================

    cart.isActive = false;

    await cart.save();

    return order;
  }

  // ============================================================
  // GET ORDER BY ID
  // ============================================================

  async getById(id: string) {
    const order =
      await orderRepository.findById(id);

    if (!order) {
      throw new NotFoundError(
        "Order not found"
      );
    }

    return order;
  }

  // ============================================================
  // GET ALL ORDERS
  // ============================================================

  async getAll(filters: {
    restaurantId?: string;
    branchId?: string;
    customerId?: string;
    tableId?: string;
    status?: string;
  }) {
    return orderRepository.findAll(
      filters
    );
  }

  // ============================================================
  // UPDATE ORDER STATUS
  // ============================================================

  async updateStatus(
    id: string,
    input: unknown,
    userId?: string
  ) {
    const data =
      updateOrderStatusSchema.parse(
        input
      );

    const order =
      await this.getById(id);

    this.validateStatusTransition(
      order.status,
      data.status
    );

    const updateData:
      Partial<IOrder> = {
        status:
          data.status,

        updatedBy: userId
          ? new Types.ObjectId(userId)
          : undefined,
      };

    const now =
      new Date();

    switch (data.status) {
      case "CONFIRMED":
        updateData.confirmedAt =
          now;
        break;

      case "PREPARING":
        updateData.preparingAt =
          now;
        break;

      case "READY":
        updateData.readyAt =
          now;
        break;

      case "SERVED":
        updateData.servedAt =
          now;
        break;

      case "COMPLETED":
        updateData.completedAt =
          now;
        break;

      case "CANCELLED":
        updateData.cancelledAt =
          now;
        break;
    }

    return orderRepository.update(
      id,
      updateData
    );
  }

  // ============================================================
  // CANCEL ORDER
  // ============================================================

  async cancel(
    id: string,
    input: unknown,
    userId?: string
  ) {
    const data =
      cancelOrderSchema.parse(
        input
      );

    const order =
      await this.getById(id);

    if (
      order.status !== "PENDING" &&
      order.status !== "CONFIRMED"
    ) {
      throw new Error(
        "Only pending or confirmed orders can be cancelled"
      );
    }

    return orderRepository.update(
      id,
      {
        status:
          "CANCELLED",

        cancellationReason:
          data.reason,

        cancelledAt:
          new Date(),

        updatedBy: userId
          ? new Types.ObjectId(userId)
          : undefined,
      }
    );
  }

  // ============================================================
  // VALIDATE STATUS TRANSITION
  // ============================================================

  private validateStatusTransition(
    current: OrderStatus,
    next: OrderStatus
  ) {
    const allowed:
      Record<
        OrderStatus,
        OrderStatus[]
      > = {
        PENDING: [
          "CONFIRMED",
          "CANCELLED",
        ],

        CONFIRMED: [
          "PREPARING",
          "CANCELLED",
        ],

        PREPARING: [
          "READY",
        ],

        READY: [
          "SERVED",
        ],

        SERVED: [
          "COMPLETED",
        ],

        COMPLETED: [],

        CANCELLED: [],
      };

    if (
      !allowed[current].includes(
        next
      )
    ) {
      throw new Error(
        `Invalid order status transition: ${current} → ${next}`
      );
    }
  }
}

// ============================================================
// EXPORT
// ============================================================

export const orderService =
  new OrderService();