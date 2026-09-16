import { Types } from "mongoose";

import {
  BadRequestError,
  NotFoundError,
} from "../../../common/errors";

import { restaurantRepository } from "../../restaurants";
import { branchRepository } from "../../branches";

import {
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
} from "../dto/inventory-item.dto";

import {
  inventoryItemRepository,
} from "../repositories/inventory-item.repository";

export class InventoryItemService {
  async create(
    data: CreateInventoryItemDto,
    userId?: string
  ) {
    if (
      !Types.ObjectId.isValid(
        data.restaurantId
      )
    ) {
      throw new BadRequestError(
        "Invalid restaurant ID."
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
      await inventoryItemRepository.findBySku(
        data.restaurantId,
        data.sku
      );

    if (existing) {
      throw new BadRequestError(
        "Inventory SKU already exists."
      );
    }

    return await inventoryItemRepository.create({
      ...data,

      restaurantId:
        new Types.ObjectId(
          data.restaurantId
        ),

      branchId: data.branchId
        ? new Types.ObjectId(data.branchId)
        : undefined,

      supplierId: data.supplierId
        ? new Types.ObjectId(data.supplierId)
        : undefined,

      sku: data.sku.toUpperCase(),

      createdBy: userId
        ? new Types.ObjectId(userId)
        : undefined,
    });
  }

  async getById(id: string) {
    const item =
      await inventoryItemRepository.findById(id);

    if (!item) {
      throw new NotFoundError(
        "Inventory item not found."
      );
    }

    return item;
  }

  async getByRestaurant(
    restaurantId: string
  ) {
    return await inventoryItemRepository.findByRestaurant(
      restaurantId
    );
  }

  async getByBranch(
    branchId: string
  ) {
    return await inventoryItemRepository.findByBranch(
      branchId
    );
  }

  async getLowStock(
    restaurantId: string
  ) {
    return await inventoryItemRepository.findLowStock(
      restaurantId
    );
  }

  async update(
    id: string,
    data: UpdateInventoryItemDto,
    userId?: string
  ) {
    const item =
      await inventoryItemRepository.findById(id);

    if (!item) {
      throw new NotFoundError(
        "Inventory item not found."
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
        item.restaurantId.toString()
      ) {
        throw new BadRequestError(
          "Branch does not belong to this restaurant."
        );
      }
    }

    if (data.sku) {
      const existing =
        await inventoryItemRepository.findBySku(
          item.restaurantId,
          data.sku
        );

      if (
        existing &&
        existing._id.toString() !== id
      ) {
        throw new BadRequestError(
          "Inventory SKU already exists."
        );
      }
    }

    return await inventoryItemRepository.update(
      id,
      {
        ...data,

        branchId: data.branchId
          ? new Types.ObjectId(
              data.branchId
            )
          : undefined,

        supplierId: data.supplierId
          ? new Types.ObjectId(
              data.supplierId
            )
          : undefined,

        sku: data.sku?.toUpperCase(),

        updatedBy: userId
          ? new Types.ObjectId(userId)
          : undefined,
      }
    );
  }

  async delete(id: string) {
    const item =
      await inventoryItemRepository.findById(id);

    if (!item) {
      throw new NotFoundError(
        "Inventory item not found."
      );
    }

    await inventoryItemRepository.softDelete(id);

    return {
      message:
        "Inventory item deleted successfully.",
    };
  }
}

export const inventoryItemService =
  new InventoryItemService();