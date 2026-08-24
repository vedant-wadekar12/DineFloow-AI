import { UnauthorizedError } from "../../../common/errors";
import { tokenUtil } from "../../../common/utilities";

import { authRepository } from "../../auth/repositories/auth.repository";
import { refreshTokenRepository } from "../repositories/refresh-token.repository";

export class RefreshTokenService {
  async refresh(refreshToken: string) {
    const storedToken =
      await refreshTokenRepository.findByToken(refreshToken);

    if (!storedToken) {
      throw new UnauthorizedError(
        "Invalid or revoked refresh token."
      );
    }

    let payload;

    try {
      payload = tokenUtil.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError(
        "Invalid or expired refresh token."
      );
    }

    if (
      payload.userId.toString() !==
      storedToken.userId.toString()
    ) {
      throw new UnauthorizedError(
        "Invalid refresh token."
      );
    }

    const user = await authRepository.findById(
      storedToken.userId
    );

    if (!user || !user.isActive || user.isDeleted) {
      throw new UnauthorizedError(
        "User account is inactive."
      );
    }

    const accessToken =
      tokenUtil.generateAccessToken({
        userId: user._id.toString(),
        email: user.email,
        roleId: user.roleId.toString(),
        restaurantId: user.restaurantId?.toString(),
        branchId: user.branchId?.toString(),
      });

    await refreshTokenRepository.updateLastUsed(
      refreshToken
    );

    return {
      accessToken,
    };
  }
}

export const refreshTokenService =
  new RefreshTokenService();