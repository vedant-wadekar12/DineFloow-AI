import { Types } from "mongoose";

import { IUser, User } from "../models/user.model";

export class AuthRepository {
  /**
   * Create User
   */
  async createUser(payload: Partial<IUser>): Promise<IUser> {
    return await User.create(payload);
  }

  /**
   * Find User By Email
   * Password is included because select:false is set in schema
   */
  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({
      email,
      isDeleted: false,
    }).select("+password +refreshToken");
  }

  /**
   * Find User By ID
   */
  async findUserById(id: string | Types.ObjectId): Promise<IUser | null> {
    return await User.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  /**
   * Find User By Phone
   */
  async findUserByPhone(phone: string): Promise<IUser | null> {
    return await User.findOne({
      phone,
      isDeleted: false,
    });
  }

  /**
   * Update Refresh Token
   */
  async updateRefreshToken(
    id: string | Types.ObjectId,
    refreshToken: string
  ): Promise<void> {
    await User.findByIdAndUpdate(id, {
      refreshToken,
    });
  }

  /**
   * Remove Refresh Token
   */
  async removeRefreshToken(
    id: string | Types.ObjectId
  ): Promise<void> {
    await User.findByIdAndUpdate(id, {
      $unset: {
        refreshToken: 1,
      },
    });
  }

  /**
   * Update Last Login
   */
  async updateLastLogin(
    id: string | Types.ObjectId
  ): Promise<void> {
    await User.findByIdAndUpdate(id, {
      lastLogin: new Date(),
    });
  }

  /**
   * Increment Login Attempts
   */
  async incrementLoginAttempts(
    id: string | Types.ObjectId
  ): Promise<void> {
    await User.findByIdAndUpdate(id, {
      $inc: {
        loginAttempts: 1,
      },
    });
  }

  /**
   * Reset Login Attempts
   */
  async resetLoginAttempts(
    id: string | Types.ObjectId
  ): Promise<void> {
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
    lockUntil: Date
  ): Promise<void> {
    await User.findByIdAndUpdate(id, {
      lockUntil,
    });
  }
}

export const authRepository = new AuthRepository();