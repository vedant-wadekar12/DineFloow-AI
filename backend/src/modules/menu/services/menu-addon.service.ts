import { Types } from "mongoose";

import {
  BadRequestError,
  NotFoundError,
} from "../../../common/errors";

import { branchRepository } from "../../branches";
import { restaurantRepository } from "../../restaurants";

import {
  CreateMenuAddonDto,
  UpdateMenuAddonDto,
} from "../dto/menu-addon.dto";

import {
  menuAddonRepository,
} from "../repositories/menu-addon.repository";

export class MenuAddonService {
  async create(
    data: CreateMenuAddonDto,
    userId?: string
  ) {
    if (
      !Types.ObjectId.isValid(data.restaurantId)
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
      await menuAddonRepository.findByName(
        data.restaurantId,
        data.name
      );

    if (existing) {
      throw new BadRequestError(
        "Add-on already exists."
      );
    }

    return await menuAddonRepository.create({
      ...data,
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
    const addon =
      await menuAddonRepository.findById(id);

    if (!addon) {
      throw new NotFoundError(
        "Add-on not found."
      );
    }

    return addon;
  }

  async getByRestaurant(
    restaurantId: string
  ) {
    return await menuAddonRepository.findByRestaurant(
      restaurantId
    );
  }

  async update(
    id: string,
    data: UpdateMenuAddonDto,
    userId?: string
  ) {
    const addon =
      await menuAddonRepository.findById(id);

    if (!addon) {
      throw new NotFoundError(
        "Add-on not found."
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
        addon.restaurantId.toString()
      ) {
        throw new BadRequestError(
          "Branch does not belong to this restaurant."
        );
      }
    }

    if (data.name) {
      const existing =
        await menuAddonRepository.findByName(
          addon.restaurantId,
          data.name
        );

      if (
        existing &&
        existing._id.toString() !== id
      ) {
        throw new BadRequestError(
          "Add-on already exists."
        );
      }
    }

    return await menuAddonRepository.update(
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
    const addon =
      await menuAddonRepository.updateAvailability(
        id,
        isAvailable
      );

    if (!addon) {
      throw new NotFoundError(
        "Add-on not found."
      );
    }

    return addon;
  }

  async delete(id: string) {
    const addon =
      await menuAddonRepository.findById(id);

    if (!addon) {
      throw new NotFoundError(
        "Add-on not found."
      );
    }

    await menuAddonRepository.softDelete(id);

    return {
      message:
        "Add-on deleted successfully.",
    };
  }
}

export const menuAddonService =
  new MenuAddonService();