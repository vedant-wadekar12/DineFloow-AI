import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "../../../common/interfaces";
import { passwordUtil } from "../../../common/utilities";

import { authRepository } from "../../auth/repositories/auth.repository";
import { userService } from "../services/user.service";

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

  async deactivateAccount(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await authRepository.deactivateAccount(
      req.user!.userId
    );

    return res.status(200).json({
      success: true,
      message: "Account deactivated successfully.",
    });
  } catch (error) {
    next(error);
  }
}
async changePassword(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { currentPassword, newPassword } = req.body;

    const user =
      await authRepository.findByIdWithPassword(
        req.user!.userId
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isValid =
      await user.comparePassword(currentPassword);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const hashedPassword =
      await passwordUtil.hash(newPassword);

    await authRepository.updatePassword(
      user._id,
      hashedPassword
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    next(error);
  }
}
async getAllUsers(
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await userService.getAll();

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully.",
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

async getUserById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await userService.getById(
      String(req.params.userId)
    );

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
}

export const userController = new UserController();