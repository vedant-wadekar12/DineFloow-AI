import { Types } from "mongoose";

import {
  IRestaurant,
  Restaurant,
} from "../models/restaurant.model";

export class RestaurantRepository {
  async create(
    payload: Partial<IRestaurant>
  ): Promise<IRestaurant> {
    return await Restaurant.create(payload);
  }

  async findById(
    id: string | Types.ObjectId
  ): Promise<IRestaurant | null> {
    return await Restaurant.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  async findBySlug(
    slug: string
  ): Promise<IRestaurant | null> {
    return await Restaurant.findOne({
      slug,
      isDeleted: false,
    });
  }

  async findByOwner(
    ownerId: string | Types.ObjectId
  ): Promise<IRestaurant[]> {
    return await Restaurant.find({
      ownerId,
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });
  }

  async findAll(): Promise<IRestaurant[]> {
    return await Restaurant.find({
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });
  }

  async update(
    id: string | Types.ObjectId,
    payload: Partial<IRestaurant>
  ): Promise<IRestaurant | null> {
    return await Restaurant.findOneAndUpdate(
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
  ): Promise<IRestaurant | null> {
    return await Restaurant.findOneAndUpdate(
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
    await Restaurant.findOneAndUpdate(
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

export const restaurantRepository =
  new RestaurantRepository();