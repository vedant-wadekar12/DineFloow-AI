import { Types } from "mongoose";

import {
  IMenuCombo,
  MenuCombo,
} from "../models/menu-combo.model";

import {
  IMenuComboItem,
  MenuComboItem,
} from "../models/menu-combo-item.model";

export class MenuComboRepository {
  async create(
    payload: Partial<IMenuCombo>
  ): Promise<IMenuCombo> {
    return await MenuCombo.create(payload);
  }

  async findById(
    id: string | Types.ObjectId
  ): Promise<IMenuCombo | null> {
    return await MenuCombo.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  async findBySlug(
    restaurantId: string | Types.ObjectId,
    slug: string
  ): Promise<IMenuCombo | null> {
    return await MenuCombo.findOne({
      restaurantId,
      slug,
      isDeleted: false,
    });
  }

  async findByRestaurant(
    restaurantId: string | Types.ObjectId
  ): Promise<IMenuCombo[]> {
    return await MenuCombo.find({
      restaurantId,
      isDeleted: false,
    }).sort({
      sortOrder: 1,
      name: 1,
    });
  }

  async update(
    id: string | Types.ObjectId,
    payload: Partial<IMenuCombo>
  ): Promise<IMenuCombo | null> {
    return await MenuCombo.findOneAndUpdate(
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
  ): Promise<IMenuCombo | null> {
    return await MenuCombo.findOneAndUpdate(
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

  async softDelete(
    id: string | Types.ObjectId
  ): Promise<void> {
    await MenuCombo.findOneAndUpdate(
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

  async createItems(
    items: Partial<IMenuComboItem>[]
  ) {
    return await MenuComboItem.insertMany(
      items
    );
  }

  async findItems(
    comboId: string | Types.ObjectId
  ): Promise<IMenuComboItem[]> {
    return await MenuComboItem.find({
      comboId,
    }).populate("menuItemId");
  }

  async deleteItems(
    comboId: string | Types.ObjectId
  ) {
    await MenuComboItem.deleteMany({
      comboId,
    });
  }
}

export const menuComboRepository =
  new MenuComboRepository();