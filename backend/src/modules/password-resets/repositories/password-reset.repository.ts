import { Types } from "mongoose";

import {
  IPasswordReset,
  PasswordReset,
} from "../models/password-reset.model";

export class PasswordResetRepository {
  async create(
    payload: Partial<IPasswordReset>
  ): Promise<IPasswordReset> {
    return await PasswordReset.create(payload);
  }

  async findByToken(
    token: string
  ): Promise<IPasswordReset | null> {
    return await PasswordReset.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });
  }

  async markUsed(
    id: string | Types.ObjectId
  ): Promise<void> {
    await PasswordReset.findByIdAndUpdate(id, {
      used: true,
    });
  }

  async deleteUserTokens(
    userId: string | Types.ObjectId
  ): Promise<void> {
    await PasswordReset.deleteMany({
      userId,
    });
  }
}

export const passwordResetRepository =
  new PasswordResetRepository();