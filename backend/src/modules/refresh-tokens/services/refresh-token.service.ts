import { UnauthorizedError } from "../../../common/errors";
import { tokenUtil } from "../../../common/utilities";

import { authRepository } from "../../auth/repositories/auth.repository";
import { refreshTokenRepository } from "../repositories/refresh-token.repository";

export class RefreshTokenService {
  async refresh(refreshToken: string) {
    /**
     * 1. Find the refresh token in MongoDB
     */
    const storedToken =
      await refreshTokenRepository.findByToken(refreshToken);

    if (!storedToken) {
      throw new UnauthorizedError(
        "Invalid or revoked refresh token."
      );
    }

    /**
     * 2. Verify JWT signature and expiration
     */
    let payload;

    try {
      payload =
        tokenUtil.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError(
        "Invalid or expired refresh token."
      );
    }

    /**
     * 3. Explicitly check database expiration.
     *
     * MongoDB TTL deletion is not necessarily immediate,
     * so we must not rely only on the TTL index.
     */
    if (storedToken.expiresAt.getTime() <= Date.now()) {
      await refreshTokenRepository.revokeToken(
        refreshToken
      );

      throw new UnauthorizedError(
        "Refresh token has expired."
      );
    }

    /**
     * 4. Make sure the JWT belongs to
     * the same user stored in MongoDB.
     */
    if (
      payload.userId.toString() !==
      storedToken.userId.toString()
    ) {
      throw new UnauthorizedError(
        "Invalid refresh token."
      );
    }

    /**
     * 5. Verify that the user still exists
     * and is allowed to access the system.
     */
    const user = await authRepository.findById(
      storedToken.userId
    );

    if (!user) {
      throw new UnauthorizedError(
        "User account no longer exists."
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedError(
        "User account is inactive."
      );
    }

    if (user.isDeleted) {
      throw new UnauthorizedError(
        "User account no longer exists."
      );
    }

    /**
     * 6. Create a new JWT payload
     */
    const jwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      roleId: user.roleId.toString(),
      restaurantId:
        user.restaurantId?.toString(),
      branchId:
        user.branchId?.toString(),
    };

    /**
     * 7. Generate new access token
     */
    const accessToken =
      tokenUtil.generateAccessToken(jwtPayload);

    /**
     * 8. Generate new refresh token
     */
    const newRefreshToken =
      tokenUtil.generateRefreshToken(jwtPayload);

    /**
     * 9. Revoke the old refresh token
     */
    await refreshTokenRepository.revokeToken(
      refreshToken
    );

    /**
     * 10. Store the new refresh token
     */
    await refreshTokenRepository.create({
      userId: user._id,
      token: newRefreshToken,
      expiresAt: new Date(
        Date.now() +
          7 * 24 * 60 * 60 * 1000
      ),
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}

export const refreshTokenService =
  new RefreshTokenService();