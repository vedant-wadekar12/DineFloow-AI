import { Types } from "mongoose";

import { IUser, User } from "../../auth/models/user.model";

export class UserRepository {
  async findAll(): Promise<IUser[]> {
    return await User.find({
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });
  }

  async findById(
    id: string | Types.ObjectId
  ): Promise<IUser | null> {
    return await User.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  async updateStatus(
    id: string | Types.ObjectId,
    isActive: boolean
  ): Promise<IUser | null> {
    return await User.findOneAndUpdate(
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
        runValidators: true,
      }
    );
  }

  async updateRole(
    id: string | Types.ObjectId,
    roleId: string | Types.ObjectId
  ): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: {
          roleId,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async softDelete(
    id: string | Types.ObjectId
  ): Promise<void> {
    await User.findOneAndUpdate(
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

export const userRepository = new UserRepository();