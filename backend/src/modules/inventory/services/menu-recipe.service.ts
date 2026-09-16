import { Types } from "mongoose";

import {
  BadRequestError,
  NotFoundError,
} from "../../../common/errors";

import { MenuItem } from "../../menu/models/menu-item.model";

import {
  InventoryItem,
} from "../models/inventory-item.model";

import {
  CreateMenuRecipeDto,
  UpdateMenuRecipeDto,
} from "../dto/menu-recipe.dto";

import {
  menuRecipeRepository,
} from "../repositories/menu-recipe.repository";

export class MenuRecipeService {
  async create(
    data: CreateMenuRecipeDto,
    userId?: string
  ) {
    if (
      !Types.ObjectId.isValid(
        data.restaurantId
      ) ||
      !Types.ObjectId.isValid(
        data.menuItemId
      ) ||
      !Types.ObjectId.isValid(
        data.inventoryItemId
      )
    ) {
      throw new BadRequestError(
        "Invalid recipe IDs."
      );
    }

    const menuItem =
      await MenuItem.findOne({
        _id: data.menuItemId,
        restaurantId:
          data.restaurantId,
        isDeleted: false,
      });

    if (!menuItem) {
      throw new NotFoundError(
        "Menu item not found."
      );
    }

    const inventoryItem =
      await InventoryItem.findOne({
        _id: data.inventoryItemId,
        restaurantId:
          data.restaurantId,
        isDeleted: false,
      });

    if (!inventoryItem) {
      throw new NotFoundError(
        "Inventory item not found."
      );
    }

    const existing =
      await menuRecipeRepository.findExisting(
        data.menuItemId,
        data.inventoryItemId
      );

    if (existing) {
      throw new BadRequestError(
        "This ingredient is already mapped to the menu item."
      );
    }

    return await menuRecipeRepository.create({
      restaurantId:
        new Types.ObjectId(
          data.restaurantId
        ),

      menuItemId:
        new Types.ObjectId(
          data.menuItemId
        ),

      inventoryItemId:
        new Types.ObjectId(
          data.inventoryItemId
        ),

      quantity: data.quantity,

      createdBy: userId
        ? new Types.ObjectId(userId)
        : undefined,
    });
  }

  async getByMenuItem(
    menuItemId: string
  ) {
    return await menuRecipeRepository.findByMenuItem(
      menuItemId
    );
  }

  async update(
    id: string,
    data: UpdateMenuRecipeDto,
    userId?: string
  ) {
    const recipe =
      await menuRecipeRepository.findById(id);

    if (!recipe) {
      throw new NotFoundError(
        "Recipe not found."
      );
    }

    return await menuRecipeRepository.update(
      id,
      data.quantity,
      userId
        ? new Types.ObjectId(userId)
        : undefined
    );
  }

  async delete(id: string) {
    const recipe =
      await menuRecipeRepository.findById(id);

    if (!recipe) {
      throw new NotFoundError(
        "Recipe not found."
      );
    }

    await menuRecipeRepository.delete(id);

    return {
      message:
        "Recipe ingredient deleted successfully.",
    };
  }
}

export const menuRecipeService =
  new MenuRecipeService();