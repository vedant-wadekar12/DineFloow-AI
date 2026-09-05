import { Types } from "mongoose";
import { ConflictError, NotFoundError } from "../../../common/errors";

import { restaurantRepository } from "../../restaurants/repositories/restaurant.repository";

import { branchRepository } from "../../branches/repositories/branch.repository";

import { categoryRepository } from "../repositories/category.repository";

export class CategoryService {
  async create(
    payload: {
      restaurantId: string;
      branchId?: string;
      name: string;
      slug: string;
      description?: string;
      image?: string;
      sortOrder?: number;
    },
    createdBy: string,
  ) {
    const restaurant = await restaurantRepository.findById(
      payload.restaurantId,
    );

    if (!restaurant) {
      throw new NotFoundError("Restaurant not found.");
    }

    if (payload.branchId) {
      const branch = await branchRepository.findById(payload.branchId);

      if (!branch) {
        throw new NotFoundError("Branch not found.");
      }

      if (branch.restaurantId.toString() !== payload.restaurantId) {
        throw new ConflictError(
          "Branch does not belong to the selected restaurant.",
        );
      }
    }

    const existing = await categoryRepository.findBySlug(
      payload.restaurantId,
      payload.branchId,
      payload.slug,
    );

    if (existing) {
      throw new ConflictError("Category slug already exists.");
    }

    return await categoryRepository.create({
      ...payload,
      restaurantId: new Types.ObjectId(payload.restaurantId),
      branchId: payload.branchId
        ? new Types.ObjectId(payload.branchId)
        : undefined,
      createdBy: new Types.ObjectId(createdBy),
      isActive: true,
      isDeleted: false,
    });
  }

  async getAll() {
    return await categoryRepository.findAll();
  }

  async getById(id: string) {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundError("Category not found.");
    }

    return category;
  }

  async getByRestaurant(restaurantId: string) {
    const restaurant = await restaurantRepository.findById(restaurantId);

    if (!restaurant) {
      throw new NotFoundError("Restaurant not found.");
    }

    return await categoryRepository.findByRestaurant(restaurantId);
  }

  async getByBranch(branchId: string) {
    const branch = await branchRepository.findById(branchId);

    if (!branch) {
      throw new NotFoundError("Branch not found.");
    }

    return await categoryRepository.findByBranch(branchId);
  }

  async update(
    id: string,
    payload: {
      name?: string;
      slug?: string;
      description?: string;
      image?: string;
      sortOrder?: number;
    },
    updatedBy: string,
  ) {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundError("Category not found.");
    }

    if (payload.slug) {
      const existing = await categoryRepository.findBySlug(
        category.restaurantId,
        category.branchId?.toString(),
        payload.slug,
      );

      if (existing && existing._id.toString() !== id) {
        throw new ConflictError("Category slug already exists.");
      }
    }

    return await categoryRepository.update(id, {
      ...payload,
      updatedBy: new Types.ObjectId(updatedBy),
    });
  }

  async updateStatus(id: string, isActive: boolean) {
    const category = await categoryRepository.updateStatus(id, isActive);

    if (!category) {
      throw new NotFoundError("Category not found.");
    }

    return category;
  }

  async delete(id: string) {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundError("Category not found.");
    }

    await categoryRepository.softDelete(id);
  }
}

export const categoryService = new CategoryService();
