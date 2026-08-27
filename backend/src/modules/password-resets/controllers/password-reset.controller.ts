import { NextFunction, Request, Response } from "express";

import { passwordResetService } from "../services/password-reset.service";

export class PasswordResetController {
  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result =
        await passwordResetService.forgotPassword(
          req.body.email
        );

      return res.status(200).json({
        success: true,
        message:
          "If the email exists, a password reset token has been generated.",
        data: result ?? null,
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await passwordResetService.resetPassword(
        req.body.token,
        req.body.newPassword
      );

      return res.status(200).json({
        success: true,
        message: "Password reset successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const passwordResetController =
  new PasswordResetController();