import { Types } from "mongoose";

import { NotFoundError } from "../../../common/errors";

import { MenuItem } from "../../menu/models/menu-item.model";
import { MenuVariant } from "../../menu/models/menu-variant.model";
import { MenuAddon } from "../../menu/models/menu-addon.model";

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

  async getById(id: string) {
    const cart =
      await cartRepository.findById(id);

    if (!cart) {
      throw new NotFoundError(
        "Cart not found"
      );
    }

    return cart;
  }

  async addItem(
    cartId: string,
    input: unknown
  ) {
    const data =
      addCartItemSchema.parse(input);

    const cart =
      await this.getById(cartId);

    const menuItem =
      await MenuItem.findOne({
        _id: data.menuItemId,
        isDeleted: false,
        isActive: true,
        isAvailable: true,
      });

    if (!menuItem) {
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
    itemId: string,
    input: unknown
  ) {
    const data =
      updateCartItemSchema.parse(input);

    const cart =
      await this.getById(cartId);

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
    itemId: string
  ) {
    const cart =
      await this.getById(cartId);

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

  async clear(cartId: string) {
    const cart =
      await this.getById(cartId);

    cart.items = [];
    cart.subtotal = 0;
    cart.discountAmount = 0;
    cart.taxAmount = 0;
    cart.totalAmount = 0;

    return cart.save();
  }

  async deactivate(cartId: string) {
    const cart =
      await cartRepository.deactivate(
        cartId
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