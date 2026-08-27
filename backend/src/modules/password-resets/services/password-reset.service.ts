import crypto from "crypto";

import { UnauthorizedError } from "../../../common/errors";
import { authRepository } from "../../auth/repositories/auth.repository";
import { passwordResetRepository } from "../repositories/password-reset.repository";
import { refreshTokenRepository } from "../../refresh-tokens/repositories/refresh-token.repository";

export class PasswordResetService {
  async forgotPassword(email: string) {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      return;
    }

    await passwordResetRepository.deleteUserTokens(user._id);

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await passwordResetRepository.create({
      userId: user._id,
      token,
      expiresAt,
      used: false,
    });

    return {
      token,
      expiresAt,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const resetToken = await passwordResetRepository.findByToken(token);

    if (!resetToken) {
      throw new UnauthorizedError("Invalid or expired password reset token.");
    }

    await authRepository.updatePassword(resetToken.userId, newPassword);

    await refreshTokenRepository.revokeAllUserTokens(resetToken.userId);

    await passwordResetRepository.markUsed(resetToken._id);

    await passwordResetRepository.deleteToken(token);

    return true;
  }
}

export const passwordResetService = new PasswordResetService();
