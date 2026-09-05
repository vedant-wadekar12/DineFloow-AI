import { Types } from "mongoose";

import {
  Category,
  ICategory,
} from "../models/category.model";

export class CategoryRepository {
  async create(
    payload: Partial<ICategory>
  ): Promise<ICategory> {
    return await Category.create(payload);
  }

  async findById(
    id: string | Types.ObjectId
  ): Promise<ICategory | null> {
    return await Category.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  async findBySlug(
    restaurantId: string | Types.ObjectId,
    branchId: string | Types.ObjectId | undefined,
    slug: string
  ): Promise<ICategory | null> {
    return await Category.findOne({
      restaurantId,
      branchId,
      slug,
      isDeleted: false,
    });
  }

  async findByRestaurant(
    restaurantId: string | Types.ObjectId
  ): Promise<ICategory[]> {
    return await Category.find({
      restaurantId,
      isDeleted: false,
    }).sort({
      sortOrder: 1,
      name: 1,
    });
  }

  async findByBranch(
    branchId: string | Types.ObjectId
  ): Promise<ICategory[]> {
    return await Category.find({
      branchId,
      isDeleted: false,
    }).sort({
      sortOrder: 1,
      name: 1,
    });
  }

  async findAll(): Promise<ICategory[]> {
    return await Category.find({
      isDeleted: false,
    }).sort({
      sortOrder: 1,
      name: 1,
    });
  }

  async update(
    id: string | Types.ObjectId,
    payload: Partial<ICategory>
  ): Promise<ICategory | null> {
    return await Category.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: payload,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async updateStatus(
    id: string | Types.ObjectId,
    isActive: boolean
  ): Promise<ICategory | null> {
    return await Category.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: {
          isActive,
        },
      },
      {
        new: true,
      }
    );
  }

  async softDelete(
    id: string | Types.ObjectId
  ): Promise<void> {
    await Category.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          isActive: false,
        },
      }
    );
  }
}

export const categoryRepository =
  new CategoryRepository();