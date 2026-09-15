import { Types } from "mongoose";

import {
  IMenuAddon,
  MenuAddon,
} from "../models/menu-addon.model";

export class MenuAddonRepository {
  async create(
    payload: Partial<IMenuAddon>
  ): Promise<IMenuAddon> {
    return await MenuAddon.create(payload);
  }

  async findById(
    id: string | Types.ObjectId
  ): Promise<IMenuAddon | null> {
    return await MenuAddon.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  async findByRestaurant(
    restaurantId: string | Types.ObjectId
  ): Promise<IMenuAddon[]> {
    return await MenuAddon.find({
      restaurantId,
      isDeleted: false,
    }).sort({
      name: 1,
    });
  }

  async findByName(
    restaurantId: string | Types.ObjectId,
    name: string
  ): Promise<IMenuAddon | null> {
    return await MenuAddon.findOne({
      restaurantId,
      name,
      isDeleted: false,
    });
  }

  async update(
    id: string | Types.ObjectId,
    payload: Partial<IMenuAddon>
  ): Promise<IMenuAddon | null> {
    return await MenuAddon.findOneAndUpdate(
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
  ): Promise<IMenuAddon | null> {
    return await MenuAddon.findOneAndUpdate(
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
    await MenuAddon.findOneAndUpdate(
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

export const menuAddonRepository =
  new MenuAddonRepository();