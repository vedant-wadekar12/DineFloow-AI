import { Types } from "mongoose";

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../../common/errors";

import {
  restaurantRepository,
} from "../../restaurants/repositories/restaurant.repository";

import { branchRepository } from "../repositories/branch.repository";
import { userRepository } from "../../users/repositories/user.repository";
import { roleRepository } from "../../roles";

export class BranchService {
  async create(
    payload: {
      restaurantId: string;
      name: string;
      code: string;
      phone: string;
      email?: string;
      address: string;
    },
    createdBy: string
  ) {
    const restaurant =
      await restaurantRepository.findByIdAndOwner(
        payload.restaurantId,
        createdBy
      );

    if (!restaurant) {
      throw new NotFoundError(
        "Restaurant not found."
      );
    }

    const existing =
      await branchRepository.findByCode(
        payload.restaurantId,
        payload.code.toUpperCase()
      );

    if (existing) {
      throw new ConflictError(
        "Branch code already exists in this restaurant."
      );
    }

    return await branchRepository.create({
      ...payload,
      restaurantId:
        new Types.ObjectId(payload.restaurantId),
      code: payload.code.toUpperCase(),
      createdBy: new Types.ObjectId(createdBy),
      isActive: true,
      isDeleted: false,
    });
  }

  async getAll(ownerId: string, restaurantId?: string) {
    if (restaurantId) {
      if (!await restaurantRepository.findByIdAndOwner(restaurantId, ownerId)) throw new NotFoundError("Restaurant not found.");
      return branchRepository.findByRestaurant(restaurantId);
    }
    const restaurants = await restaurantRepository.findByOwner(ownerId);
    return branchRepository.findByRestaurants(restaurants.map((restaurant) => restaurant._id));
  }

  async getById(
    id: string,
    ownerId: string
  ) {
    const branch =
      await branchRepository.findByIdAndOwner(
        id,
        ownerId
      );

    if (!branch) {
      throw new NotFoundError(
        "Branch not found."
      );
    }

    return branch;
  }

  async getByRestaurant(
    restaurantId: string,
    ownerId: string
  ) {
    const restaurant =
      await restaurantRepository.findByIdAndOwner(
        restaurantId,
        ownerId
      );

    if (!restaurant) {
      throw new NotFoundError(
        "Restaurant not found."
      );
    }

    return await branchRepository.findByRestaurant(
      restaurantId
    );
  }

  async update(
    id: string,
    payload: {
      name?: string;
      code?: string;
      phone?: string;
      email?: string;
      address?: string;
    },
    updatedBy: string
  ) {
    const branch =
      await branchRepository.findByIdAndOwner(
        id,
        updatedBy
      );

    if (!branch) {
      throw new NotFoundError(
        "Branch not found."
      );
    }

    if (payload.code) {
      const code =
        payload.code.toUpperCase();

      const existing =
        await branchRepository.findByCode(
          branch.restaurantId,
          code
        );

      if (
        existing &&
        existing._id.toString() !== id
      ) {
        throw new ConflictError(
          "Branch code already exists."
        );
      }

      payload.code = code;
    }

    return await branchRepository.updateByOwner(
      id,
      updatedBy,
      {
        ...payload,
        updatedBy:
          new Types.ObjectId(updatedBy),
      }
    );
  }

  async updateStatus(
    id: string,
    isActive: boolean,
    ownerId: string
  ) {
    const branch =
      await branchRepository.updateStatusByOwner(
        id,
        ownerId,
        isActive
      );

    if (!branch) {
      throw new NotFoundError(
        "Branch not found."
      );
    }

    return branch;
  }

  async assignManager(id: string, managerId: string, ownerId: string) {
    const branch = await branchRepository.findByIdAndOwner(id, ownerId);
    if (!branch) throw new NotFoundError("Branch not found.");
    if (!Types.ObjectId.isValid(managerId)) throw new BadRequestError("Invalid manager ID.");
    const manager = await userRepository.findByIdAndRestaurant(managerId, branch.restaurantId);
    if (!manager || !manager.isActive) throw new NotFoundError("Manager not found.");
    const role = await roleRepository.findById(manager.roleId);
    if (!role || role.name !== "BRANCH_MANAGER" || !role.isActive) throw new BadRequestError("Selected user is not an active branch manager.");
    return branchRepository.assignManager(id, managerId);
  }

  async delete(
    id: string,
    ownerId: string
  ) {
    const branch =
      await branchRepository.findByIdAndOwner(
        id,
        ownerId
      );

    if (!branch) {
      throw new NotFoundError(
        "Branch not found."
      );
    }

    await branchRepository.softDeleteByOwner(
      id,
      ownerId
    );
  }
}

export const branchService =
  new BranchService();