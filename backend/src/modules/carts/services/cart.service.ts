import { Types } from "mongoose";

import { BadRequestError, NotFoundError } from "../../../common/errors";

import { MenuItem } from "../../menu/models/menu-item.model";
import { MenuVariant } from "../../menu/models/menu-variant.model";
import { MenuAddon } from "../../menu/models/menu-addon.model";
import { Restaurant } from "../../restaurants/models/restaurant.model";
import { Branch } from "../../branches/models/branch.model";
import { Table } from "../../tables/models/table.model";
import { Customer } from "../../customers/models/customer.model";

import { cartRepository } from "../repositories/cart.repository";

import {
  createCartSchema,
  addCartItemSchema,
  updateCartItemSchema,
} from "../validators/cart.validator";

export class CartService {
  private calculateTotals(
    items: {
      totalPrice: number;
    }[]
  ) {
    const subtotal = items.reduce(
      (sum, item) =>
        sum + item.totalPrice,
      0
    );

    return {
      subtotal,
      discountAmount: 0,
      taxAmount: 0,
      totalAmount: subtotal,
    };
  }

  async create(input: unknown) {
    const data =
      createCartSchema.parse(input);

    if (!Types.ObjectId.isValid(data.restaurantId)) {
      throw new BadRequestError("Invalid restaurant ID.");
    }

    const restaurant = await Restaurant.findOne({
      _id: data.restaurantId,
      isActive: true,
      isDeleted: false,
    });

    if (!restaurant) {
      throw new NotFoundError("Restaurant not found.");
    }

    if (data.branchId) {
      if (!Types.ObjectId.isValid(data.branchId)) {
        throw new BadRequestError("Invalid branch ID.");
      }
      const branch = await Branch.findOne({
        _id: data.branchId,
        restaurantId: data.restaurantId,
        isActive: true,
        isDeleted: false,
      });
      if (!branch) throw new NotFoundError("Branch not found.");
    }

    if (data.tableId) {
      if (!Types.ObjectId.isValid(data.tableId)) {
        throw new BadRequestError("Invalid table ID.");
      }
      const table = await Table.findOne({
        _id: data.tableId,
        restaurantId: data.restaurantId,
        ...(data.branchId ? { branchId: data.branchId } : {}),
        isActive: true,
        isDeleted: false,
      });
      if (!table) throw new NotFoundError("Table not found.");
    }

    if (data.customerId) {
      if (!Types.ObjectId.isValid(data.customerId)) {
        throw new BadRequestError("Invalid customer ID.");
      }
      const customer = await Customer.findOne({
        _id: data.customerId,
        restaurantId: data.restaurantId,
        isDeleted: false,
      });
      if (!customer) throw new NotFoundError("Customer not found.");
    }

    const existing =
      await cartRepository.findActiveBySession(
        data.sessionId,
        data.restaurantId,
        data.branchId
      );

    if (existing) {
      return existing;
    }

    return cartRepository.create({
      restaurantId:
        new Types.ObjectId(
          data.restaurantId
        ),

      branchId: data.branchId
        ? new Types.ObjectId(data.branchId)
        : undefined,

      customerId: data.customerId
        ? new Types.ObjectId(data.customerId)
        : undefined,

      tableId: data.tableId
        ? new Types.ObjectId(data.tableId)
        : undefined,

      sessionId: data.sessionId,

      items: [],

      subtotal: 0,
      discountAmount: 0,
      taxAmount: 0,
      totalAmount: 0,

      isActive: true,
    });
  }

  async getById(id: string, sessionId: string) {
    const cart =
      await cartRepository.findById(id, sessionId);

    if (!cart) {
      throw new NotFoundError(
        "Cart not found"
      );
    }

    return cart;
  }

  async addItem(
    cartId: string,
    sessionId: string,
    input: unknown
  ) {
    const data =
      addCartItemSchema.parse(input);

    const cart =
      await this.getById(cartId, sessionId);

    const menuItem =
      await MenuItem.findOne({
        _id: data.menuItemId,
        isDeleted: false,
        isActive: true,
        isAvailable: true,
      });

    if (!menuItem || menuItem.restaurantId.toString() !== cart.restaurantId.toString()) {
      throw new NotFoundError(
        "Menu item is not available"
      );
    }

    let unitPrice =
      menuItem.discountPrice ??
      menuItem.price;

    if (data.variantId) {
      const variant =
        await MenuVariant.findOne({
          _id: data.variantId,
          menuItemId: data.menuItemId,
          restaurantId: cart.restaurantId,
          isDeleted: false,
          isActive: true,
          isAvailable: true,
        });

      if (!variant) {
        throw new NotFoundError(
          "Menu variant is not available"
        );
      }

      unitPrice =
        variant.discountPrice ??
        variant.price;
    }

    const selectedAddons = [];

    if (data.selectedAddons?.length) {
      for (const selected of data.selectedAddons) {
        const addon =
          await MenuAddon.findOne({
            _id: selected.addonId,
            restaurantId: cart.restaurantId,
            isDeleted: false,
            isActive: true,
            isAvailable: true,
          });

        if (!addon) {
          throw new NotFoundError(
            `Addon ${selected.addonId} is not available`
          );
        }

        selectedAddons.push({
          addonId:
            new Types.ObjectId(
              selected.addonId
            ),

          quantity: selected.quantity,

          unitPrice: addon.price,
        });
      }
    }

    const addonTotal =
      selectedAddons.reduce(
        (sum, addon) =>
          sum +
          addon.unitPrice *
            addon.quantity,
        0
      );

    const itemTotal =
      (unitPrice + addonTotal) *
      data.quantity;

    cart.items.push({
      menuItemId:
        new Types.ObjectId(
          data.menuItemId
        ),

      variantId: data.variantId
        ? new Types.ObjectId(
            data.variantId
          )
        : undefined,

      quantity: data.quantity,

      unitPrice,

      selectedAddons,

      specialInstructions:
        data.specialInstructions,

      totalPrice: itemTotal,
    });

    const totals =
      this.calculateTotals(
        cart.items
      );

    cart.subtotal =
      totals.subtotal;

    cart.discountAmount =
      totals.discountAmount;

    cart.taxAmount =
      totals.taxAmount;

    cart.totalAmount =
      totals.totalAmount;

    return cart.save();
  }

  async updateItem(
    cartId: string,
    sessionId: string,
    itemId: string,
    input: unknown
  ) {
    const data =
      updateCartItemSchema.parse(input);

    const cart =
      await this.getById(cartId, sessionId);

    const item = cart.items.find(
      (cartItem) =>
        cartItem._id?.toString() ===
        itemId
    );

    if (!item) {
      throw new NotFoundError(
        "Cart item not found"
      );
    }

    item.quantity = data.quantity;

    if (
      data.specialInstructions !==
      undefined
    ) {
      item.specialInstructions =
        data.specialInstructions;
    }

    const addonTotal =
      item.selectedAddons?.reduce(
        (sum, addon) =>
          sum +
          addon.unitPrice *
            addon.quantity,
        0
      ) ?? 0;

    item.totalPrice =
      (item.unitPrice +
        addonTotal) *
      item.quantity;

    const totals =
      this.calculateTotals(
        cart.items
      );

    cart.subtotal =
      totals.subtotal;

    cart.discountAmount =
      totals.discountAmount;

    cart.taxAmount =
      totals.taxAmount;

    cart.totalAmount =
      totals.totalAmount;

    return cart.save();
  }

  async removeItem(
    cartId: string,
    sessionId: string,
    itemId: string
  ) {
    const cart =
      await this.getById(cartId, sessionId);

    const itemExists =
      cart.items.some(
        (item) =>
          item._id?.toString() ===
          itemId
      );

    if (!itemExists) {
      throw new NotFoundError(
        "Cart item not found"
      );
    }

    cart.items =
      cart.items.filter(
        (item) =>
          item._id?.toString() !==
          itemId
      );

    const totals =
      this.calculateTotals(
        cart.items
      );

    cart.subtotal =
      totals.subtotal;

    cart.discountAmount =
      totals.discountAmount;

    cart.taxAmount =
      totals.taxAmount;

    cart.totalAmount =
      totals.totalAmount;

    return cart.save();
  }

  async clear(cartId: string, sessionId: string) {
    const cart =
      await this.getById(cartId, sessionId);

    cart.items = [];
    cart.subtotal = 0;
    cart.discountAmount = 0;
    cart.taxAmount = 0;
    cart.totalAmount = 0;

    return cart.save();
  }

  async deactivate(cartId: string, sessionId: string) {
    const cart =
      await cartRepository.deactivate(
        cartId,
        sessionId
      );

    if (!cart) {
      throw new NotFoundError(
        "Cart not found"
      );
    }

    return cart;
  }
}

export const cartService =
  new CartService();