import { Types } from "mongoose";
import {
  ConflictError,
  NotFoundError,
} from "../../../common/errors";

import {
  restaurantRepository,
} from "../../restaurants/repositories/restaurant.repository";

import {
  branchRepository,
} from "../repositories/branch.repository";

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
      await restaurantRepository.findById(
        payload.restaurantId
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
      restaurantId: new Types.ObjectId(payload.restaurantId),
      code: payload.code.toUpperCase(),
      createdBy: new Types.ObjectId(createdBy),
      isActive: true,
      isDeleted: false,
    });
  }

  async getAll() {
    return await branchRepository.findAll();
  }

  async getById(id: string) {
    const branch =
      await branchRepository.findById(id);

    if (!branch) {
      throw new NotFoundError(
        "Branch not found."
      );
    }

    return branch;
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
      await branchRepository.findById(id);

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

    return await branchRepository.update(
      id,
      {
        ...payload,
        updatedBy: new Types.ObjectId(updatedBy),
      }
    );
  }

  async updateStatus(
    id: string,
    isActive: boolean
  ) {
    const branch =
      await branchRepository.updateStatus(
        id,
        isActive
      );

    if (!branch) {
      throw new NotFoundError(
        "Branch not found."
      );
    }

    return branch;
  }

  async assignManager(
    id: string,
    managerId: string
  ) {
    const branch =
      await branchRepository.assignManager(
        id,
        managerId
      );

    if (!branch) {
      throw new NotFoundError(
        "Branch not found."
      );
    }

    return branch;
  }

  async delete(id: string) {
    const branch =
      await branchRepository.findById(id);

    if (!branch) {
      throw new NotFoundError(
        "Branch not found."
      );
    }

    await branchRepository.softDelete(id);
  }
}

export const branchService =
  new BranchService();