import { Types } from "mongoose";

import {
  BadRequestError,
  NotFoundError,
} from "../../../common/errors";

import { MenuItem } from "../models/menu-item.model";
import { branchRepository } from "../../branches";
import { restaurantRepository } from "../../restaurants";

import {
  CreateMenuVariantDto,
  UpdateMenuVariantDto,
} from "../dto/menu-variant.dto";

import {
  menuVariantRepository,
} from "../repositories/menu-variant.repository";

export class MenuVariantService {
  async create(
    data: CreateMenuVariantDto,
    userId?: string
  ) {
    if (
      !Types.ObjectId.isValid(data.menuItemId) ||
      !Types.ObjectId.isValid(data.restaurantId)
    ) {
      throw new BadRequestError(
        "Invalid menu item or restaurant ID."
      );
    }

    const menuItem = await MenuItem.findOne({
      _id: data.menuItemId,
      isDeleted: false,
    });

    if (!menuItem) {
      throw new NotFoundError(
        "Menu item not found."
      );
    }

    if (
      menuItem.restaurantId.toString() !==
      data.restaurantId
    ) {
      throw new BadRequestError(
        "Menu item does not belong to this restaurant."
      );
    }

    const restaurant =
      await restaurantRepository.findById(
        data.restaurantId
      );

    if (!restaurant) {
      throw new NotFoundError(
        "Restaurant not found."
      );
    }

    if (data.branchId) {
      const branch =
        await branchRepository.findById(
          data.branchId
        );

      if (!branch) {
        throw new NotFoundError(
          "Branch not found."
        );
      }

      if (
        branch.restaurantId.toString() !==
        data.restaurantId
      ) {
        throw new BadRequestError(
          "Branch does not belong to this restaurant."
        );
      }
    }

    const existing =
      await menuVariantRepository.findByName(
        data.menuItemId,
        data.name
      );

    if (existing) {
      throw new BadRequestError(
        "Variant already exists for this menu item."
      );
    }

    return await menuVariantRepository.create({
      ...data,
      menuItemId: new Types.ObjectId(
        data.menuItemId
      ),
      restaurantId: new Types.ObjectId(
        data.restaurantId
      ),
      branchId: data.branchId
        ? new Types.ObjectId(data.branchId)
        : undefined,
      createdBy: userId
        ? new Types.ObjectId(userId)
        : undefined,
    });
  }

  async getById(id: string) {
    const variant =
      await menuVariantRepository.findById(id);

    if (!variant) {
      throw new NotFoundError(
        "Menu variant not found."
      );
    }

    return variant;
  }

  async getByMenuItem(menuItemId: string) {
    return await menuVariantRepository.findByMenuItem(
      menuItemId
    );
  }

  async update(
    id: string,
    data: UpdateMenuVariantDto,
    userId?: string
  ) {
    const variant =
      await menuVariantRepository.findById(id);

    if (!variant) {
      throw new NotFoundError(
        "Menu variant not found."
      );
    }

    if (data.branchId) {
      const branch =
        await branchRepository.findById(
          data.branchId
        );

      if (!branch) {
        throw new NotFoundError(
          "Branch not found."
        );
      }

      if (
        branch.restaurantId.toString() !==
        variant.restaurantId.toString()
      ) {
        throw new BadRequestError(
          "Branch does not belong to this restaurant."
        );
      }
    }

    if (data.name) {
      const existing =
        await menuVariantRepository.findByName(
          variant.menuItemId,
          data.name
        );

      if (
        existing &&
        existing._id.toString() !== id
      ) {
        throw new BadRequestError(
          "Variant name already exists."
        );
      }
    }

    return await menuVariantRepository.update(
      id,
      {
        ...data,
        branchId: data.branchId
          ? new Types.ObjectId(data.branchId)
          : undefined,
        updatedBy: userId
          ? new Types.ObjectId(userId)
          : undefined,
      }
    );
  }

  async updateAvailability(
    id: string,
    isAvailable: boolean
  ) {
    const variant =
      await menuVariantRepository.updateAvailability(
        id,
        isAvailable
      );

    if (!variant) {
      throw new NotFoundError(
        "Menu variant not found."
      );
    }

    return variant;
  }

  async delete(id: string) {
    const variant =
      await menuVariantRepository.findById(id);

    if (!variant) {
      throw new NotFoundError(
        "Menu variant not found."
      );
    }

    await menuVariantRepository.softDelete(id);

    return {
      message:
        "Menu variant deleted successfully.",
    };
  }
}

export const menuVariantService =
  new MenuVariantService();