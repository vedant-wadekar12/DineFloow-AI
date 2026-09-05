import {
  ConflictError,
  NotFoundError,
} from "../../../common/errors";

import {
  restaurantRepository,
} from "../../restaurants/repositories/restaurant.repository";

import {
  branchRepository,
} from "../../branches/repositories/branch.repository";

import {
  categoryRepository,
} from "../../categories/repositories/category.repository";

import {
  menuItemRepository,
} from "../repositories/menu-item.repository";
import { Types } from "mongoose";

export class MenuItemService {
  async create(
    payload: {
      restaurantId: string;
      branchId?: string;
      categoryId: string;

      name: string;
      slug: string;
      description?: string;

      type:
        | "FOOD"
        | "BEVERAGE"
        | "DESSERT"
        | "OTHER";

      price: number;
      discountPrice?: number;

      image?: string;

      isVegetarian?: boolean;
      isVegan?: boolean;

      preparationTime?: number;
      sortOrder?: number;
    },
    createdBy: string
  ) {
    const restaurant =
      await restaurantRepository.findById(
        payload.restaurantId
      );

    if (!restaurant) {
      throw new NotFoundError(
        "Restaurant not found."
      );
    }

    if (payload.branchId) {
      const branch =
        await branchRepository.findById(
          payload.branchId
        );

      if (!branch) {
        throw new NotFoundError(
          "Branch not found."
        );
      }

      if (
        branch.restaurantId.toString() !==
        payload.restaurantId
      ) {
        throw new ConflictError(
          "Branch does not belong to the selected restaurant."
        );
      }
    }

    const category =
      await categoryRepository.findById(
        payload.categoryId
      );

    if (!category) {
      throw new NotFoundError(
        "Category not found."
      );
    }

    if (
      category.restaurantId.toString() !==
      payload.restaurantId
    ) {
      throw new ConflictError(
        "Category does not belong to the selected restaurant."
      );
    }

    if (
      payload.branchId &&
      category.branchId &&
      category.branchId.toString() !==
        payload.branchId
    ) {
      throw new ConflictError(
        "Category does not belong to the selected branch."
      );
    }

    const existing =
      await menuItemRepository.findBySlug(
        payload.restaurantId,
        payload.branchId,
        payload.slug
      );

    if (existing) {
      throw new ConflictError(
        "Menu item slug already exists."
      );
    }

    return await menuItemRepository.create({
  ...payload,
  restaurantId: new Types.ObjectId(payload.restaurantId),
  branchId: payload.branchId
    ? new Types.ObjectId(payload.branchId)
    : undefined,
  categoryId: new Types.ObjectId(payload.categoryId),
  isVegetarian:
    payload.isVegetarian ?? false,
  isVegan:
    payload.isVegan ?? false,
  isAvailable: true,
  isActive: true,
  isDeleted: false,
  createdBy: new Types.ObjectId(createdBy),
});
  }

  async getAll() {
    return await menuItemRepository.findAll();
  }

  async getById(id: string) {
    const item =
      await menuItemRepository.findById(id);

    if (!item) {
      throw new NotFoundError(
        "Menu item not found."
      );
    }

    return item;
  }

  async getByRestaurant(
    restaurantId: string
  ) {
    const restaurant =
      await restaurantRepository.findById(
        restaurantId
      );

    if (!restaurant) {
      throw new NotFoundError(
        "Restaurant not found."
      );
    }

    return await menuItemRepository.findByRestaurant(
      restaurantId
    );
  }

  async getByBranch(
    branchId: string
  ) {
    const branch =
      await branchRepository.findById(
        branchId
      );

    if (!branch) {
      throw new NotFoundError(
        "Branch not found."
      );
    }

    return await menuItemRepository.findByBranch(
      branchId
    );
  }

  async getByCategory(
    categoryId: string
  ) {
    const category =
      await categoryRepository.findById(
        categoryId
      );

    if (!category) {
      throw new NotFoundError(
        "Category not found."
      );
    }

    return await menuItemRepository.findByCategory(
      categoryId
    );
  }

  async update(
    id: string,
    payload: {
      categoryId?: string;

      name?: string;
      slug?: string;
      description?: string;

      type?:
        | "FOOD"
        | "BEVERAGE"
        | "DESSERT"
        | "OTHER";

      price?: number;
      discountPrice?: number;

      image?: string;

      isVegetarian?: boolean;
      isVegan?: boolean;

      preparationTime?: number;
      sortOrder?: number;
    },
    updatedBy: string
  ) {
    const item =
      await menuItemRepository.findById(id);

    if (!item) {
      throw new NotFoundError(
        "Menu item not found."
      );
    }

    if (payload.categoryId) {
      const category =
        await categoryRepository.findById(
          payload.categoryId
        );

      if (!category) {
        throw new NotFoundError(
          "Category not found."
        );
      }

      if (
        category.restaurantId.toString() !==
        item.restaurantId.toString()
      ) {
        throw new ConflictError(
          "Category does not belong to this restaurant."
        );
      }
    }

    if (payload.slug) {
      const existing =
        await menuItemRepository.findBySlug(
          item.restaurantId,
          item.branchId?.toString(),
          payload.slug
        );

      if (
        existing &&
        existing._id.toString() !== id
      ) {
        throw new ConflictError(
          "Menu item slug already exists."
        );
      }
    }

    return await menuItemRepository.update(
  id,
  {
    ...payload,
    categoryId: payload.categoryId
      ? new Types.ObjectId(payload.categoryId)
      : undefined,
    updatedBy: new Types.ObjectId(updatedBy),
  }
);
  }

  async updateAvailability(
    id: string,
    isAvailable: boolean
  ) {
    const item =
      await menuItemRepository.updateAvailability(
        id,
        isAvailable
      );

    if (!item) {
      throw new NotFoundError(
        "Menu item not found."
      );
    }

    return item;
  }

  async updateStatus(
    id: string,
    isActive: boolean
  ) {
    const item =
      await menuItemRepository.updateStatus(
        id,
        isActive
      );

    if (!item) {
      throw new NotFoundError(
        "Menu item not found."
      );
    }

    return item;
  }

  async delete(id: string) {
    const item =
      await menuItemRepository.findById(id);

    if (!item) {
      throw new NotFoundError(
        "Menu item not found."
      );
    }

    await menuItemRepository.softDelete(id);
  }
}

export const menuItemService =
  new MenuItemService();