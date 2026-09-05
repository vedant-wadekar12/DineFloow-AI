import { Types } from "mongoose";

import {
  IMenuItem,
  MenuItem,
  MenuItemType,
} from "../models/menu-item.model";

export class MenuItemRepository {
  async create(
    payload: Partial<IMenuItem>
  ): Promise<IMenuItem> {
    return await MenuItem.create(payload);
  }

  async findById(
    id: string | Types.ObjectId
  ): Promise<IMenuItem | null> {
    return await MenuItem.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  async findBySlug(
    restaurantId: string | Types.ObjectId,
    branchId: string | Types.ObjectId | undefined,
    slug: string
  ): Promise<IMenuItem | null> {
    return await MenuItem.findOne({
      restaurantId,
      branchId,
      slug,
      isDeleted: false,
    });
  }

  async findAll(): Promise<IMenuItem[]> {
    return await MenuItem.find({
      isDeleted: false,
    })
      .populate("categoryId")
      .sort({
        sortOrder: 1,
        name: 1,
      });
  }

  async findByRestaurant(
    restaurantId: string | Types.ObjectId
  ): Promise<IMenuItem[]> {
    return await MenuItem.find({
      restaurantId,
      isDeleted: false,
    })
      .populate("categoryId")
      .sort({
        sortOrder: 1,
        name: 1,
      });
  }

  async findByBranch(
    branchId: string | Types.ObjectId
  ): Promise<IMenuItem[]> {
    return await MenuItem.find({
      branchId,
      isDeleted: false,
    })
      .populate("categoryId")
      .sort({
        sortOrder: 1,
        name: 1,
      });
  }

  async findByCategory(
    categoryId: string | Types.ObjectId
  ): Promise<IMenuItem[]> {
    return await MenuItem.find({
      categoryId,
      isDeleted: false,
    }).sort({
      sortOrder: 1,
      name: 1,
    });
  }

  async update(
    id: string | Types.ObjectId,
    payload: Partial<IMenuItem>
  ): Promise<IMenuItem | null> {
    return await MenuItem.findOneAndUpdate(
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

  async updateAvailability(
    id: string | Types.ObjectId,
    isAvailable: boolean
  ): Promise<IMenuItem | null> {
    return await MenuItem.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: {
          isAvailable,
        },
      },
      {
        new: true,
      }
    );
  }

  async updateStatus(
    id: string | Types.ObjectId,
    isActive: boolean
  ): Promise<IMenuItem | null> {
    return await MenuItem.findOneAndUpdate(
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
    await MenuItem.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          isActive: false,
          isAvailable: false,
        },
      }
    );
  }
}

export const menuItemRepository =
  new MenuItemRepository();