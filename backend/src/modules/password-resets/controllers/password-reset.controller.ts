import { NextFunction, Request, Response } from "express";

import { passwordResetService } from "../services/password-reset.service";

export class PasswordResetController {
  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await passwordResetService.forgotPassword(
        req.body.email
      );

      return res.status(200).json({
        success: true,
        message:
          "If an account exists for this email, password reset instructions have been sent.",
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