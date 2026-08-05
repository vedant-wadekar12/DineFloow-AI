import { Types } from "mongoose";

import {
  IRefreshToken,
  RefreshToken,
} from "../models/refresh-token.model";

export class RefreshTokenRepository {
  async create(
    payload: Partial<IRefreshToken>
  ): Promise<IRefreshToken> {
    return await RefreshToken.create(payload);
  }

  async findByToken(
    token: string
  ): Promise<IRefreshToken | null> {
    return await RefreshToken.findOne({
      token,
      isRevoked: false,
    });
  }

  async revokeToken(token: string): Promise<void> {
    await RefreshToken.updateOne(
      { token },
      {
        isRevoked: true,
      }
    );
  }

  async revokeAllUserTokens(
    userId: string | Types.ObjectId
  ): Promise<void> {
    await RefreshToken.updateMany(
      { userId },
      {
        isRevoked: true,
      }
    );
  }

  async updateLastUsed(
    token: string
  ): Promise<void> {
    await RefreshToken.updateOne(
      { token },
      {
        lastUsedAt: new Date(),
      }
    );
  }
}

export const refreshTokenRepository =
  new RefreshTokenRepository();