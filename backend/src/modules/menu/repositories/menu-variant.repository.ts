import { Types } from "mongoose";
import {
  IMenuVariant,
  MenuVariant,
} from "../models/menu-variant.model";

export class MenuVariantRepository {
  async create(
    payload: Partial<IMenuVariant>
  ): Promise<IMenuVariant> {
    return await MenuVariant.create(payload);
  }

  async findById(
    id: string | Types.ObjectId
  ): Promise<IMenuVariant | null> {
    return await MenuVariant.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  async findByMenuItem(
    menuItemId: string | Types.ObjectId
  ): Promise<IMenuVariant[]> {
    return await MenuVariant.find({
      menuItemId,
      isDeleted: false,
    }).sort({
      sortOrder: 1,
      name: 1,
    });
  }

  async findByName(
    menuItemId: string | Types.ObjectId,
    name: string
  ): Promise<IMenuVariant | null> {
    return await MenuVariant.findOne({
      menuItemId,
      name,
      isDeleted: false,
    });
  }

  async update(
    id: string | Types.ObjectId,
    payload: Partial<IMenuVariant>
  ): Promise<IMenuVariant | null> {
    return await MenuVariant.findOneAndUpdate(
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
  ): Promise<IMenuVariant | null> {
    return await MenuVariant.findOneAndUpdate(
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
    await MenuVariant.findOneAndUpdate(
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

export const menuVariantRepository =
  new MenuVariantRepository();