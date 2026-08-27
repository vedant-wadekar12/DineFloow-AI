import { Types } from "mongoose";

import { IUser, User } from "../models/user.model";

import { passwordUtil } from "../../../common/utilities";

export class AuthRepository {
  /**
   * Create User
   */
  async create(payload: Partial<IUser>): Promise<IUser> {
    return await User.create(payload);
  }

  /**
   * Find User By Email
   *
   * Password is explicitly selected because
   * password has select: false in the schema.
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({
      email,
      isDeleted: false,
    }).select("+password");
  }

  /**
   * Find User By ID
   */
  async findById(id: string | Types.ObjectId): Promise<IUser | null> {
    return await User.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  /**
   * Find User By Phone
   */
  async findByPhone(phone: string): Promise<IUser | null> {
    return await User.findOne({
      phone,
      isDeleted: false,
    });
  }

  /**
   * Update Last Login
   */
  async updateLastLogin(id: string | Types.ObjectId): Promise<void> {
    await User.findByIdAndUpdate(id, {
      lastLogin: new Date(),
    });
  }

  /**
   * Increment Login Attempts
   */
  async incrementLoginAttempts(id: string | Types.ObjectId): Promise<void> {
    await User.findByIdAndUpdate(id, {
      $inc: {
        loginAttempts: 1,
      },
    });
  }

  /**
   * Reset Login Attempts
   */
  async resetLoginAttempts(id: string | Types.ObjectId): Promise<void> {
    await User.findByIdAndUpdate(id, {
      loginAttempts: 0,
      $unset: {
        lockUntil: 1,
      },
    });
  }

  /**
   * Lock Account
   */
  async lockAccount(
    id: string | Types.ObjectId,
    lockUntil: Date,
  ): Promise<void> {
    await User.findByIdAndUpdate(id, {
      lockUntil,
    });
  }

  /**
   * Update User Profile
   */
  async updateProfile(
    id: string,
    payload: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      profileImage?: string;
    },
  ): Promise<IUser | null> {
    return await User.findOneAndUpdate(
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
      },
    );
  }

  /**
   * Deactivate Account
   */
  async deactivateAccount(id: string | Types.ObjectId): Promise<void> {
    await User.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: {
          isActive: false,
        },
      },
    );
  }

  async findByIdWithPassword(
    id: string | Types.ObjectId,
  ): Promise<IUser | null> {
    return await User.findOne({
      _id: id,
      isDeleted: false,
    }).select("+password");
  }

  async updatePassword(
  id: string | Types.ObjectId,
  password: string
): Promise<void> {
  const hashedPassword =
    await passwordUtil.hash(password);

  await User.findByIdAndUpdate(id, {
    password: hashedPassword,
    passwordChangedAt: new Date(),
  });
}
}

export const authRepository = new AuthRepository();
