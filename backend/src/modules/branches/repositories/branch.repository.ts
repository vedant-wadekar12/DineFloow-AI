import { Types } from "mongoose";

import {
  Branch,
  IBranch,
} from "../models/branch.model";

import {
  User,
} from "../../auth/models/user.model";

import {
  Restaurant,
} from "../../restaurants/models/restaurant.model";

export class BranchRepository {
  async create(
    payload: Partial<IBranch>
  ): Promise<IBranch> {
    return await Branch.create(payload);
  }

  async findById(
    id: string | Types.ObjectId
  ): Promise<IBranch | null> {
    return await Branch.findOne({
      _id: id,
      isDeleted: false,
    });
  }

async findByIdAndRestaurant(
  id: string | Types.ObjectId,
  restaurantId: string | Types.ObjectId
): Promise<IBranch | null> {
  return await Branch.findOne({
    _id: id,
    restaurantId,
    isDeleted: false,
  });
}

  async findByIdAndOwner(
    id: string | Types.ObjectId,
    ownerId: string | Types.ObjectId
  ): Promise<IBranch | null> {
    const restaurants =
      await Restaurant.find({
        ownerId,
        isDeleted: false,
      }).select("_id");

    const restaurantIds =
      restaurants.map(
        (restaurant) => restaurant._id
      );

    return await Branch.findOne({
      _id: id,
      restaurantId: {
        $in: restaurantIds,
      },
      isDeleted: false,
    });
  }

  async findByCode(
    restaurantId: string | Types.ObjectId,
    code: string
  ): Promise<IBranch | null> {
    return await Branch.findOne({
      restaurantId,
      code,
      isDeleted: false,
    });
  }

  async findByRestaurant(
    restaurantId: string | Types.ObjectId
  ): Promise<IBranch[]> {
    return await Branch.find({
      restaurantId,
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });
  }

  async findByRestaurants(
    restaurantIds: Types.ObjectId[]
  ): Promise<IBranch[]> {
    return await Branch.find({
      restaurantId: {
        $in: restaurantIds,
      },
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });
  }

  async findAll(): Promise<IBranch[]> {
    return await Branch.find({
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });
  }

  async update(
    id: string | Types.ObjectId,
    payload: Partial<IBranch>
  ): Promise<IBranch | null> {
    return await Branch.findOneAndUpdate(
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

  async updateByOwner(
    id: string | Types.ObjectId,
    ownerId: string | Types.ObjectId,
    payload: Partial<IBranch>
  ): Promise<IBranch | null> {
    const restaurants =
      await Restaurant.find({
        ownerId,
        isDeleted: false,
      }).select("_id");

    const restaurantIds =
      restaurants.map(
        (restaurant) => restaurant._id
      );

    return await Branch.findOneAndUpdate(
      {
        _id: id,
        restaurantId: {
          $in: restaurantIds,
        },
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
  ): Promise<IBranch | null> {
    return await Branch.findOneAndUpdate(
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

  async updateStatusByOwner(
    id: string | Types.ObjectId,
    ownerId: string | Types.ObjectId,
    isActive: boolean
  ): Promise<IBranch | null> {
    const restaurants =
      await Restaurant.find({
        ownerId,
        isDeleted: false,
      }).select("_id");

    const restaurantIds =
      restaurants.map(
        (restaurant) => restaurant._id
      );

    return await Branch.findOneAndUpdate(
      {
        _id: id,
        restaurantId: {
          $in: restaurantIds,
        },
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

  async assignManager(
    id: string | Types.ObjectId,
    managerId: string | Types.ObjectId
  ): Promise<IBranch | null> {
    return await Branch.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: {
          managerId,
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
    await Branch.findOneAndUpdate(
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

  async softDeleteByOwner(
    id: string | Types.ObjectId,
    ownerId: string | Types.ObjectId
  ): Promise<void> {
    const restaurants =
      await Restaurant.find({
        ownerId,
        isDeleted: false,
      }).select("_id");

    const restaurantIds =
      restaurants.map(
        (restaurant) => restaurant._id
      );

    await Branch.findOneAndUpdate(
      {
        _id: id,
        restaurantId: {
          $in: restaurantIds,
        },
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

export const branchRepository =
  new BranchRepository();