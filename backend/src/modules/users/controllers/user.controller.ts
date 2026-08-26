import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "../../../common/interfaces";
import { authRepository } from "../../auth/repositories/auth.repository";

export class UserController {
  /**
   * Get User Profile
   */
  async getProfile(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await authRepository.findById(
        req.user!.userId
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User profile retrieved successfully.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update User Profile
   */
  async updateProfile(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await authRepository.updateProfile(
        req.user!.userId,
        req.body
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User profile updated successfully.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();